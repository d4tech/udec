from webapp2 import WSGIApplication

import main

app = WSGIApplication([
		('/rest/getBlobUploader', main.SendBlobUploader),
		('/rest/upload', main.UploadHandler)
	],debug=True)