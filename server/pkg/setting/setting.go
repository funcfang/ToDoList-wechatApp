package setting

import (
	"github.com/go-ini/ini"
	"log"
	"time"
)

var (
	Cfg *ini.File
	MiniAPP *ini.File

	RunMode string

	HTTPPort     int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration

	LogSavePath string
	LogSaveName string
	LogFileExt  string
	TimeFormat  string

	PageSize  int
	JwtSecret string

	APPID string
	AppSecret string
)

func init() {
	var err error
	Cfg, err = ini.Load("conf/app.ini")
	MiniAPP, err = ini.Load("conf/miniapp.ini")
	if err != nil {
		log.Fatalf("Fail to parse 'conf/app.ini': %v", err)
	}

	LoadBase()
	LoadServer()
	LoadApp()
	LoadMiniApp() //微信小程序
}

func LoadBase() {
	RunMode = Cfg.Section("").Key("RUN_MODE").MustString("debug")
}

func LoadServer() {
	sec, err := Cfg.GetSection("server")
	if err != nil {
		log.Fatalf("Fail to get section 'server': %v", err)
	}

	HTTPPort = sec.Key("HTTP_PORT").MustInt(8000)
	ReadTimeout = time.Duration(sec.Key("READ_TIMEOUT").MustInt(60)) * time.Second
	WriteTimeout = time.Duration(sec.Key("WRITE_TIMEOUT").MustInt(60)) * time.Second
}

func LoadApp() {
	sec, err := Cfg.GetSection("app")
	if err != nil {
		log.Fatalf("Fail to get section 'app': %v", err)
	}

	JwtSecret = sec.Key("JWT_SECRET").MustString("!@)*#)!@U#@*!@!)")
	PageSize = sec.Key("PAGE_SIZE").MustInt(10)
}


func LoadMiniApp(){
	sec, err := MiniAPP.GetSection("miniapp")
	if err != nil {
		log.Fatalf("Fail to get section 'app': %v", err)
	}

	APPID = sec.Key("APPID").MustString("")
	AppSecret = sec.Key("AppSecret").MustString("")
}
