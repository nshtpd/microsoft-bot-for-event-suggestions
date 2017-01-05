import requests, json, re, sys
from pyspark import SparkConf, SparkContext
from operator import add

conf = SparkConf()
conf.setMaster("spark://nishit:7077")# set to your spark master url
conf.setAppName("FBAPI")
sc = SparkContext(conf = conf)

location = str(sys.argv[1])
access_token = str(sys.argv[2])

mainDataURL = "https://graph.facebook.com/v2.8/search?q="+location+"&type=event&access_token="+access_token+"&limit=999"

mainDataResponse = requests.get(mainDataURL)

fbDataRDD = sc.parallelize(json.loads(mainDataResponse.text)['data'])
fbDataRDD = fbDataRDD.map(lambda line: [int(line['id']), line])

def getPeopleCount(line):
	peopleDataURL = "https://graph.facebook.com/v2.8/"+str(line[0])+"/attending?access_token="+access_token+"&limit=2799"
	peopleDataResponse = requests.get(peopleDataURL)
	return [int(line[0]), len(json.loads(peopleDataResponse.text)['data'])]

fbPeopleRDD = fbDataRDD.map(getPeopleCount)
fbPeopleRDD = sc.parallelize(fbPeopleRDD.takeOrdered(10, lambda line: -line[1]))

joinedRDD = fbPeopleRDD.join(fbDataRDD)
joinedRDD = joinedRDD.map(lambda line: {"EventID": str(line[0]), "details":str(line[1][1]), "count":int(line[1][0])})
#joinedRDD.saveAsTextFile("file:///home/hduser/Result/")

print joinedRDD.collect()
