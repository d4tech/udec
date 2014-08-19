from google.appengine.ext import ndb

class FileList(ndb.Model):
	user = ndb.StringProperty()
	blob_key = ndb.BlobKeyProperty()
	file_name = ndb.StringProperty()
	time = ndb.DateTimeProperty(auto_now = True)