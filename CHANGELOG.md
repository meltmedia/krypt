## 0.1.0 (3/7/2014)

+ Initial release

## 0.2.0 (3/7/2014)

+ Updated defaults for key lenght / stretching iterations
+ Enhanced the output to be portable across future versions of Krypt

## 0.2.1 (3/7/2014)

+ Fixed module export

## 0.2.2 (3/7/2014)

+ Fixed typo in payload

## 0.3.0 (3/18/2014)

+ Updated `keyLength` to be expressed in bits (w/ legacy support for converting 32 Byte length keys)
+ Added support to inject custom context into the encrypted result
  + Useful for recording metadata, such as the name of the key you are using, etc.

## 0.4.0 (7/17/2015)

+ Support async encryption / decryption thanks to Spencer Rinehart (@nubs)
  + Introduction of explicit `encryptSync`, `encryptAsync` and `decryptSync` and `decryptAsync` methods.
  + `encrypt` and `decrypt` will automatically choose async or sync based on the presence of a callback.
