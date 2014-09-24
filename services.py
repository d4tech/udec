from webapp2 import WSGIApplication

import main

app = WSGIApplication([
		('/rest/getBlobUploader', main.SendBlobUploader),
		('/rest/upload', main.UploadHandler),
		('/rest/home', main.QueryHandler),
		('/rest/serve/([^/]+)?', main.BlobServeHandler)
	],debug=True)