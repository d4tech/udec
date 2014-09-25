import json
import webapp2
import time
import urllib

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers

import model

def AsDict(file):
  return {"blob_key": str(file.blob_key), "file_name": file.file_name, "modified_date": str(file.time)}

class LastFile:
    __key = None

    @classmethod
    def __init__(cls,blob_key = None):
        if blob_key == None:
            pass
        elif type(cls.__key) == type(None):
           cls.__key = blob_key
        elif cls.__key != blob_key:
            cls.__key = blob_key
        else:
            raise ValueError('Previously stored file')

    @classmethod
    def get(cls):
        if cls.__key is not None:
            return cls.__key
        else:
            raise TypeError('No key stored')

    @classmethod
    def set(cls,blob_key):
        if cls.__key != blob_key:
            cls.__key = blob_key
        else:
            raise ValueError('Previously stored file')

lastUploaded = LastFile();


class RestHandler(webapp2.RequestHandler):
	def SendJson(self, r):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.write(json.dumps(r))

class QueryHandler(RestHandler):
	def get(self):
	    files = model.AllFiles()
	    r = [ AsDict(file) for file in files ]
	    self.SendJson(r)


class LastUploadedFile(RestHandler):
        def get(self):
            lastFile = lastUploaded.get() 
            self.SendJson(str(lastFile))


class SendBlobUploader(RestHandler):
	def get(self):
		upload_url = blobstore.create_upload_url('/rest/upload')
                self.SendJson(upload_url)

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
	def post(self):
		upload_file = self.get_uploads('file')[0]
                lastUploaded.set(upload_file.key())
                file = model.FileList(user = 'me', blob_key = upload_file.key(), file_name = upload_file.filename)
		file.put()

class BlobServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
	def get(self, resource):
	    resource = str(urllib.unquote(resource))
	    blob_info = blobstore.BlobInfo.get(resource)
	    self.send_blob(blob_info)
		

# app = webapp2.WSGIApplication([
# 		('/rest/getBlobUploader', SendBlobUploader),
# 		('/upload', UploadHandler)
# 	], debug=True)

