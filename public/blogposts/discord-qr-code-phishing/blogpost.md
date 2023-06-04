Here's a guide on how to recognize the Discord QR code scam, which is a common vector through which accounts are compromised.

It usually starts with a friend DMing you a server invite unprompted.

![initial message](initial.png)

So you join the server, and you're greeted with a request for verification:

![verification prompt with qr code](verification.png)

Once you scan the code, that's it&mdash;you've handed total access of your account to whoever generated the sign-in link.

Some things to note:
- This attack **bypasses 2FA**.
- Even though the QR code points to an official discord.com URL, you will still be hacked!

# How does it work?

Some time ago, Discord introduced a feature that enables you to quickly sign in by scanning a QR code from a device where you're already signed in.

![signin screen](signin-example.png)

After scanning the code, you're prompted over whether you want to log in.

<img style="max-width: 300px" src="phone-prompt.png" alt="phone prompt screen">

If you tap "Yes, log me in", this triggers an authenticated request to Discord's servers, which then signs you in wherever the QR code was first generated. As you can see, this system is ripe for abuse when combined with a little bit of social engineering. If you are unlucky enough to sign in without heeding Discord's warning, this is what you're greeted with:

![verified](verified.png)

And soon afterwards&hellip;

![pwned](pwned.png)

&hellip;you become one with the horde.

# How To Protect Yourself

- If a friend randomly sends you a server invite, don't join it! It's probably a scam&mdash;confirm that they still have control over the account first.
- Heed the warning given by the Discord app carefully. Never, ever click the "Yes, log me in" button unless the QR code you scanned came from the sign in page.

For more information on attacks of this type, check out OWASP's page on [QRLJacking](https://owasp.org/www-community/attacks/Qrljacking).