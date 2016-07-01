# Undetectable Extension Charm _(UDeC)_

The inspiration behind this project is a bag called the beaded bag carried by Hermione Granger in the series Harry Potter by JK Rowling. What made this innocent handbag so special was that Hermione had placed a spell called the Undetectable Extension Charm, This sophisticated charm has two main effects: 

1.To reduce an object’s( that has to be stored) dimension, so that one can store a lot of objects, whatever be it's size. In real world this  would be called Compression. 

2.The charm also magically disguises itself so that no one but the caster (and those the caster confides about the charm in) can realise that this spell has been cast over the object, even if they are experiencing it. Outside Harry Potter this phenomenon is called Encryption.
We would like to implement this charm, on Beaded Bag of this real dimension; The Cloud.

The main aim behind UDeC is to provide At-Rest data encryption, the compression is already provided by the Cloud service providers themselves, so we won't be concentrating on that part of Hermione’s Charm.
UDeC will initially be a web service, (desktop clients will be designed later)  where the user will provide UDeC with OAuth access to his Cloud services, using these Access Tokens, we’ll club the entirety of users cloud space into a single storage entity, For eg, if the user is customer to Dropbox(2 GB), Google Storage(15 GB) and Amazon S3(15 GB), when the user provides his OAuth access, UDeC will show files from all these three seperate services as a single storage medium of 32GB. To upload files the user will point to the File/Folder in the Local Filesystem of the user, and UDeC at server side will make the decision as to where the file would be stored based on different variables.

The main feature is At-Rest Data Encryption. A few of the existing Cloud solutions also provide At-Rest Encryption, but the problem is that the encryption key is generated at the Server Side by the service provider, and the Key Ring is stored with the provider itself. The problem with such a system is pretty much self explanatory, even though the data is encrypted, ultimately the provider has access to the data, the only question is that as to why does the Service Provider even chooses to encrypt the data in the first place, if the provider can see it.
UDeC overcomes this problem by performing the entire task of key generation and encryption at the client side itself and it's the encrypted data that is, forwarded to the web server. Now, automatically the question arises as to how will UDeC solve the problem of key storage, We propose that the Key Ring be encrypted by a key privy to the user only . Doing so ensures that only the user has access to his files because as previously stated all Encryption and Decryption happens at the Client side on user’s terminal.

## Modules:
* Client Side :
  * Web Client( JavaScript, html5, CSS).
  * Performs Key generation, Encryption and Decryption.

* Server side :
  * A server that has OAuth access tokens to the users Cloud Solutions Provider.
  * An engine that decides with which service provider to store the data.
  
## Implementation details:
* The client side is done in angularjs with CryptoJS for encryption.
* Server side is Google App Engine.
