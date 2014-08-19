import json
import webapp2
import time
import urllib

from google.appengine.ext import blobstore
from google.appengine.ext.webapp import blobstore_handlers

import model

class RestHandler(webapp2.RequestHandler):
	def SendJson(self, r):
		self.response.headers['content-type'] = 'text/plain'
		self.response.write(json.dumps(r))

class SendBlobUploader(RestHandler):
	def get(self):
		upload_url = blobstore.create_upload_url('/rest/upload')
		self.SendJson(upload_url)

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
	def post(self):
		upload_file = self.get_uploads('file')[0]
		file = model.FileList(user = 'me', blob_key = upload_file.key(), file_name = upload_file.filename)
		file.put()



# app = webapp2.WSGIApplication([
# 		('/rest/getBlobUploader', SendBlobUploader),
# 		('/upload', UploadHandler)
# 	], debug=True)

