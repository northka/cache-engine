const NodeCache = require( "node-cache" )
const pool = {}
let   myCache = null

module.exports = {
	request: function(reqObj, successCallback, errorCallback, requestListner){
		const type = reqObj.type || this.option.type ||'get'
		const cache = reqObj.id ? pool[reqObj.id] : myCache
		let success
		switch(type){
			case 'get':
				success = cache.get(reqObj.key)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'set':
				success = cache.set(reqObj.key, reqObj.value, reqObj.ttl)
				success ? successCallback(success) : errorCallback(success)
				break
			case 'mget':
				successCallback(cache.mget(reqObj.keys))
				break
			case 'delete':
				successCallback(cache.del(reqObj.key))
				break
			case 'ttl':
				success = cache.ttl(reqObj.key, reqObj.ttl)
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
			if(config.event){
				config.event.set && poolConfig[config.id].on("set", config.event.set)
				config.event.del && poolConfig[config.id].on("del", config.event.del)
				config.event.flush && poolConfig[config.id].on("flush", config.event.flush)
				config.event.expired && poolConfig[config.id].on("expired", config.event.expired)
			}
			return
		}
		myCache = new NodeCache(config)
		if(config.event){
			config.event.set && myCache.on("set", config.event.set)
			config.event.del && myCache.on("del", config.event.del)
			config.event.flush && myCache.on("flush", config.event.flush)
			config.event.expired && myCache.on("expired", config.event.expired)
		}
	}
}