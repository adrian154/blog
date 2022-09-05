QR codes have been in the news recently, and for good reason; we've spent years honing our suspicious link recognition instincts, only for them to be utterly sidestepped by our QR code scanning obsession. Here's a guide on how to recognize this scam.

It all starts with a message like this from a friend.

![initial message](initial.png)

So you join the server, and you're greeted with a request for verification:

![verification prompt with qr code](verification.png)

Once you scan the code, that's it&mdash;you've handed total access of your account to whoever generated the sign-in link.

# Why does this work?

If you haven't logged into Discord recently, here's what you are greeted with when you are not signed in to the app.

![signin screen](signin-example.png)

The indended flow looks something like this: when you scan the QR code on a device where you're already signed into Discord, you're prompted over whether you want to log in.

<img style="max-width: 300px" src="phone-prompt.png" alt="phone prompt screen">

If you tap "Yes, log me in", this triggers an authenticated request to Discord's servers, which then signs you in wherever the QR code was first generated. As you can see, this system is ripe for abuse when combined with a little bit of social engineering. If you are unlucky enough to sign in without heeding Discord's warning, this is what you're greeted with:

![verified](verified.png)

And soon afterwards&hellip;

![pwned](pwned.png)

&hellip;you become one with the horde.

# How To Protect Yourself

Some time ago, Discord introduced a screen that is shown to the user before signing them in warning that they may be getting phished. This has helped reduce the impact of this scam, but there are still a few lessons to be learned:
- Be careful about scanning weird QR codes! They are becoming increasingly popular as a phishing vector since users are much less careful to look at the actual URL.
- I'm not sure who needs to hear this, but if your friend sends you a random server invite, it is usually not in your best interest to join. At least ask them for context frst.

If you see the Discord icon at the center of the QR code, that is a sure-fire sign that you are being phished. However, it is totally possible to generate a QR code without the Discord logo present.