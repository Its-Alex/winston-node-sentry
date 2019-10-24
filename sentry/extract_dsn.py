print("http://%s:%s@0.0.0.0:8028/1" % (ProjectKey.objects.first().public_key, ProjectKey.objects.first().secret_key))
