
# TAMUHacks 2019 - Auto2F Authenticator
###  Auto2F Authenticator
> Let us help you get rid of remembering all those passwords
and resetting it back once you forget. What ***Auto2F Authenticator*** 
has to present you will provide you with all those security measures 
that a conventional password authentication system has to offer; with 
an additional layer of **auto 2 factor authentication**, making it more secure.

## Usage:

 1. To login to our site, just type in your email@address.com. 
 2. You will receive a click-Sign On email from us. 
 3. Upon clicking the link, if the individual is the first time user, they are asked to scan a QR code displayed on the screen.  
 4. The secret from the QR code is now stored onto your cellphone. If the user is a returning user, they may have QR secret already present on their cellular device.  
 5. Upon clicking the link, it will try to retrieve the QR secret key back to
    it via Bluetooth (WIP), and send it to the server for validation. 
6. If the keys match, they are allowed to login without requiring them
    to enter any form of passwords.

## Requirements:
> ***Auto2Fapp*** - Our official authenticator app available on PlayStore
