const NodeCache = require( "node-cache" )
const pool = {}
const myCache = null

module.export = {
	request: function(reqObj, successCallback, errorCallback, requestListner){
		const type = reqObj.type || 'get'
		const cache = reqObj.id ? pool[reqObj.id] : myCache
		switch(type){
			case 'get':
				let success = cache.get(reqObj.key)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'set':
				let success = cache.set(reqObj.key, reqObj.value, reqObj.ttl)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'mget':
				successCallback(cache.mget(reqObj.keys))
				break
			case 'delete':
				successCallback(cache.del(reqObj.key))
				break
			case 'ttl':
				let success = cache.ttl(reqObj.key, reqObj.ttl)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'getttl':
				let ttl = cache.getTtl(reqObj.key)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'keys':
				successCallback(cache.keys())
				break
			case 'stats':
				successCallback(cache.getStats())
				break
			case 'event':
				cache.on(reqObj.eventName, reqObj.callback)
				successCallback(true)
				break
			default:
		}
	},
	poolConfig: function(config){
		if(config.id){
			pool[config.id] = new NodeCache(config)
			return
		}
		myCache = new NodeCache(config)
	}
}