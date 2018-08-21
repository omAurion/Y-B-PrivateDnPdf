import $ from "jquery";
import config from "./util/config";
import EventEmitter from "micro-events";

class Checker extends EventEmitter {

    constructor() {
        super();
        this.online = true;
    }

    start() {
        var request = {
            url: config.serverURL + "/ping",
            method: "GET"
        };

        let check = function () {
            $.ajax(request)
                .done((response)=> {
                    this.online = true;
                    this.response = response;
                    this.err = null;
                    this.emit("online");
                }).fail((xhr, err, message)=> {
                    this.online = false;
                    this.response = null;
                    this.err = {
                        error: err,
                        message: message,
                        responseText: xhr.responseText
                    };
                    this.emit("offline");
                });
        }

        setTimeout(check, 30 * 1000);
        check();
    }

}

export default new Checker();