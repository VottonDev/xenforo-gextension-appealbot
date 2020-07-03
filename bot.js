// this code was just put together quickly and is pretty messy, you've been warned

wrapper = require("api-wrapper")
mysql = require("mysql")
auth = require("./auth.json")

forum = wrapper.create({
	root: auth.xf_url + "/api/",
	parseJson: true,
	requestDefaults: {
		headers: {"XF-Api-Key": auth.xf_token}
	},
	get: {
		getThreads: "threads/",
		getThread: "threads/${id}/",
		getUser: "users/${id}/",
		getForum: "forums/${id}/threads/",
		getMessage: "posts/${id}/"
	},
	post: {
		postMessage: "posts/?thread_id|message",
		updateThread: "threads/${id}/?prefix_id|title|discussion_open|sticky|custom_fields|add_tags|remove_tags"
	}
})


forumDb = undefined
panelDb = undefined

function dbConnect() {
	forumDb = mysql.createConnection({
		host: auth.db_ip,
		user: auth.forum_user,
		password: auth.forum_pass,
		database: auth.forum_db
	})

	panelDb = mysql.createConnection({
		host: auth.db_ip,
		user: auth.panel_user,
		password: auth.panel_pass,
		database: auth.panel_db
	})

	forumDb.connect(function(err) {
		if (err) {
			console.log("[MYSQL] " + err)
		} 
		else {
			console.log("[MYSQL] Connected to forum datbase!")
		}
	})

	panelDb.connect(function(err) {
		if (err) {
			console.log("[MYSQL] " + err)
		} 
		else {
			console.log("[MYSQL] Connected to panel database!")
		}
	})
}


function getBanAppeals() {
	forum.getForum({id: 10}, "", function(error, message, body) {
		body.threads.forEach(function(val) {
			if (val.title.toLowerCase().includes("ban appeal")) {
				checkBanAppeal(val.title, val.thread_id, val.custom_fields, val.userid)
			}
		})
	})
}

function checkBanAppeal(title, threadid, data, userid) {
	forum.getThread({id: threadid}, "", function(z, x, c) {
		forum.getMessage({id: c.thread.first_post_id}, "", function(error, msg, body) {
			var msg = body.post.message
			console.log("----------")
			console.log(msg)
		})
	})
}

function getUserSteamID(userid) {

}

function getBanOnUser(steamid) {

}

function threadSetTitle(threadid, xTitle) {
	forum.updateThread({title: xTitle}, "")
}

function setThreadData(threadid, value) {
	forum.updateThread({custom_fields: {value: "true"}}, "", function(error, msg, body) {
		console.log(body)
	})
}

dbConnect()
getBanAppeals()


const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
  

  await snooze(2000)
  main()
};

main()