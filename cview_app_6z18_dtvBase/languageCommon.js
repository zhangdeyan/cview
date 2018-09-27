function LanguageCommon() {
    var self = this;
    //current langauge index
    this.menuLanguageIndex = 0;
    this.menuLanguageArray = ["繁体中文", "English"];


    //languaeg change cb
    this.changeCbArray = [];
    /*
    *	init menu language
    */
    this.init = function () {
        this.changeCbArray = [];
        if (sysCom.config.menuLanguageIndex < 0 || sysCom.config.menuLanguageIndex > 1)
            sysCom.config.menuLanguageIndex = 0;

        this.menuLanguageIndex = sysCom.config.menuLanguageIndex;
        console.log("menuLanguageIndex:" + self.menuLanguageIndex);
    };

    this.reset = function () {
        this.menuLanguageIndex = sysCom.config.menuLanguageIndex = 0;
    };

    this.registerChangeLanguageCb = function (cb) {
        this.changeCbArray.push(cb);
    };

    this.setMenuLanguage = function (index) {
        if (index < self.menuLanguageArray.length && index != this.menuLanguageIndex) {
            this.menuLanguageIndex = index;
        }
        sysCom.config.menuLanguageIndex = index;
        sysCom.saveConfig();
        for (var i = 0; i < self.changeCbArray.length; i++) {
            self.changeCbArray[i]();
        }
    };
    this.getMenuLanguage = function () {
        return this.menuLanguageIndex;
    };
}

var languageCom = new LanguageCommon();
languageCom.init();
var Lp = null;
console.log("LpInit init");

function LpInit() {
    Lp =
        {
            Utf8ToUnicode: function (strUtf8) {
                var bstr = "";
                var nTotalChars = strUtf8.length; // total chars to be processed.
                var nOffset = 0; // processing point on strUtf8
                var nRemainingBytes = nTotalChars; // how many bytes left to be converted
                var nOutputPosition = 0;
                var iCode, iCode1, iCode2; // the value of the unicode.
                while (nOffset < nTotalChars) {
                    iCode = strUtf8.charCodeAt(nOffset);
                    if ((iCode & 0x80) == 0) // 1 byte.
                    {
                        if (nRemainingBytes < 1) // not enough data
                        {
                            break;
                        }
                        bstr += String.fromCharCode(iCode & 0x7F);
                        nOffset++;
                        nRemainingBytes -= 1;
                    }
                    else if ((iCode & 0xE0) == 0xC0) // 2 bytes
                    {
                        iCode1 = strUtf8.charCodeAt(nOffset + 1);
                        if (nRemainingBytes < 2 || // not enough data
                            (iCode1 & 0xC0) != 0x80) // invalid pattern
                        {
                            break;
                        }
                        bstr += String
                            .fromCharCode(((iCode & 0x3F) << 6) | (iCode1 & 0x3F));
                        nOffset += 2;
                        nRemainingBytes -= 2;
                    }
                    else if ((iCode & 0xF0) == 0xE0) // 3 bytes
                    {
                        iCode1 = strUtf8.charCodeAt(nOffset + 1);
                        iCode2 = strUtf8.charCodeAt(nOffset + 2);
                        if (nRemainingBytes < 3 || // not enough data
                            (iCode1 & 0xC0) != 0x80 || // invalid pattern
                            (iCode2 & 0xC0) != 0x80) {
                            break;
                        }
                        bstr += String.fromCharCode(((iCode & 0x0F) << 12)
                            | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
                        nOffset += 3;
                        nRemainingBytes -= 3;
                    }
                    else
                    // 4 or more bytes -- unsupported
                    {
                        break;
                    }
                }
                if (nRemainingBytes != 0) { // bad UTF8 string.
                    return "";
                }
                return bstr;
            },
            getValue: function (name, index) {
                if (!Lp[name]) {
                    return "";
                }

                if (index == 0 || index == 1) {
                    return this.Utf8ToUnicode(Lp[name][index]);
                }

                return this.Utf8ToUnicode(Lp[name][languageCom.menuLanguageIndex]);
            },

            "Traditional_Chinese": ["繁体中文", "繁体中文"],
            //input dialog
            "Input_Invalid_Tip": ["您輸入的頻道不存在，請重新輸入!", "The channel does not exist,please input again!"],
            "Pls_Input_Passwd": ["請輸入密碼", "Please input password"],
            "Please_Input_New_Password": ["請輸入新密碼", "Please input New password"],
            "Pls_Input_Passwd_1": ["請輸入工程密碼", "Please input engineering  password"],
            "Pls_Input_Passwd_2": ["請輸入個人密碼", "please input personal password"],
            "Password_Error": ["密碼錯誤，請重新輸入", "Password Error,please input again"],
            "Ok": ["確認", "OK"],
            "Cancel": ["取消", "Cancel"],

            "channel": ["頻道", "Channel"],
            "info1": ["訊息", "Info"],
            "other_info1": ["其他訊息", "Other Info"],
            "stbInfo": ["機上盒訊息", "STB Info"],
            "stbModel": ["機上盒型號", "STB Model"],
            "caCardNum5": ["智慧卡後五位", "Five bits behind the smart card"],

            "isExitTimeShift": ["正在進行時移，是否退出？", "TimeShift is Ongoing, Do you want to exit it?"],
            //live
            //banner
            "channel_name": ["频道名称", "Channel Name"],
            "Program_synopsis": ["節目簡介", "Program Introduction"],
            "Change_channel": ["切換頻道", "Switch Channel"],
            "ChangeMultiLanguage": ["聲音切換", "Bilingual Switching"],
            "ChangeSub": ["字幕切換", "Subtitle Switching"],
            "Change_Switch": ["字幕開關", " Subtitle Switch"],
            "Main_Subtitle":["主要字幕語言","Prefered Language"],
            "Timeshift": ["時光平移", "TimeShift"],
            "Channel_List": ["頻道列表", "Channel List"],
            "No_Channels": ["目前沒有任何頻道", "No Channels"],
            "Search_Channels_Frist": ["請先搜尋頻道", "Please Search Channels First"],
            "Main_Menu": ["主畫面", "Main Menu"],
            "NoPfInfo": ["沒有節目資訊", "No Program Information"],
            "audio_track": ["音軌", "Track"],
            "subtitle": ["字幕", "Subtitle"],
            "subtClose": ["字幕關", "Subtitle Close"],
            "pf_lock_msg": ["節目資訊鎖定", "Program Introduction Locked"],

            "w0": ["日", "Sun."],
            "w1": ["一", "Mon."],
            "w2": ["二", "Tue."],
            "w3": ["三", "Wed."],
            "w4": ["四", "Thu."],
            "w5": ["五", "Fri."],
            "w6": ["六", "Sat."],

            //channel list
            "Tv_Channel": ["電視頻道", "TV CHANNELS"],
            "Add_Favorite": ["新增喜愛", "Add Favorite"],
            "Cancel_Favorite": ["取消喜愛", "Cancel Favorite"],
            "Switch_Channel": ["切換頻道", "Switch Channel"],
            "last_page": ["返回", "Back"],

            //channel list
            "fav_Channel": ["喜愛頻道", "Favorites"],
            "All_Channel": ["所有頻道", "All Channels"],
            "Public_Welfare_Religion": ["公益/宗教", "Public Welfare/Religion"],
            "Drama_Music": ["戲劇/音樂", "Drama/Music"],
            "News_Finance": ["新聞/財經", "News/Finance"],
            "Leisure_Knowledge": ["休閒/新知", "Leisure/Knowledge"],
            "Children_Animation": ["兒童/卡通", "Children/Animation"],
            "Films_Series": ["電影/影集", "Films/Series"],
            "Variety": ["綜藝/綜合", "Variety"],
            "Home_Shopping": ["購物", "Home Shopping"],
            "Foreign_Language_Learning": ["外語/學習", "Foreign Language/Learning"],
            "HD": ["HD高畫質", "HD Channels"],
            "Sports_Others": ["體育運動/其他", "Sports/Others"],
            "AdultList": ["成人", "Adult"],

            //epg
            "epg_program_list": ["節目表", "EPG"],
            "epg_nav_summary": ["簡介", "Summary"],
            "epg_nav_remind_view": ["提醒收視", "Remind TV"],
            "epg_nav_remind": ["預約提醒", "Reservation Reminder"],
            "epg_nav_cancel_remind": ["取消提醒", "Cancel Reminder"],
            "epg_nav_remind_channel": ["提醒節目表", "Reminder List"],
            "epg_nav_record": ["預約錄影", "PVR Reservation"],
            "epg_nav_cancel_record": ["取消錄影", "Cancel PVR"],
            "epg_nav_lock": ["輸入親子鎖", "Input Parental Control Pin"],
            "epg_nav_last": ["返回", "Back"],
            "epg_lock_msg": ["節目資訊鎖定", "Program Introduction Locked"],

            "remind_expired": ["預約時間已過期，請重新選擇.", "Reservation time has expired, please do reselection."],
            "remind_conflict": ["預約衝突", "Reservation Conflicts"],
            "remind_conflict_ask_str": ["預約發生衝突,您確定要替換已預約的節目嗎?", "Reservation conflicts. Are you sure to replace scheduled programs?"],
            "new_remind_conflict": ["新預約:", "New Reservations"],
            "old_remind_conflict": ["已預約:", "Already Reserved"],

            "remind_single_record": ["預約單集錄制", "Reserve Single Recording"],
            "remind_serial_record": ["預約系列錄制", "Reserve Serial Recording"],

            "serial_record_has_record": ["該系列錄製已添加!", "This series of recording has been added!"],

            "cancel_single_record": ["取消單集", "Cancel Single Recording"],
            "cancel_serial_record": ["取消系列", "Cancel Serial Recording"],
            "tips": ["提示", "Tips"],

            "recrodTimeExpire": ["預約失敗:開始時間過期", "Scheduled Failed: Start Time Expired"],
            "isStopRecording": ["本節目正在錄影，是否需要停止錄影？", "The program is recording,Do you want to stop it?"],
            "addRecordIngFail": ["添加預約錄製失败！", "Add Reservation Recording Failed!"],
            "addRecordIngSuccess": ["添加預約錄製成功！", "Add Reservation Recording Successfully!"],
            "noPVRService": ["錄影功能未開通", "PVR is not opened up"],
            "noPVRDISK": ["請連接錄影用硬碟機。(代碼:PVR002)", "Please connect PVR with the HDD.(Code:PVR002)"],
            "musicCantRecord": ["音樂頻道目前不支持錄影。(代碼: PVR012)", "Music channel does not support PVR now.(Code:PVR012)"],
            "musicCantTimeshift": ["音樂頻道目前不支持時移。(代碼: PVR013)", "Music channel does not support TimeShift now.(Code:PVR013)"],
            "noSignText": ["無訊號或訊號不良，請確認訊號纜線已接妥或洽客服中心 (代碼：E200)", "Signal is not stable. Please check your connection of RF cable first. (Code: E200)"],
            "noCardText": ["智慧卡未插入，請插入智慧卡 (代碼：E009)", "Smart Card is Removed! Insert the Smart Card! (Code: E009)"],
            "eventLockText": ["節目已鎖定，請輸入親子鎖密碼", "The program has been locked, please enter the parental control lock password"],
            "noCertificationText": ["未訂購本節目", "No order the program"],

            //reminder list
            "channlNum": ["頻道號", "Channel No."],
            "channle": ["頻道", "Channel Name"],
            "programName": ["節目名稱", "Program Name"],
            "date": ["日期", "Date"],
            "time": ["時間", "Time"],
            "cancel_recording": ["取消預約", "Cancel Reservation"],

            //record by time
            "record_list": ["預約錄影清單", "Scheduled List"],
            "record_by_time": ["錄影 > 定時預約", "PVR > Schedule By Time"],
            "select_channel": ["選擇頻道", "Choose Channel"],
            "recordMode": ["錄製模式", "Record Mode"],
            "set_time": ["設置時間", "Set Time"],
            "select_week": ["選擇星期", "Choose Week"],
            "start_date": ["開始日期", "Start Date"],
            "start_time": ["開始時間", "Start Time"],
            "record_time": ["錄制時長", "Recording Time"],
            "oneTimeRecord": ["單次錄", "Single Record"],
            "everyDayRecord": ["每天錄", "Daily Record"],
            "everyWeekRecord": ["每周錄", "Weekly Record"],
            "recording": ["預約", "Reserve"],
            "schedule": ["預約", "Schedule"],
            "am": ["上午", "AM"],
            "pm": ["下午", "PM"],
            "single": ["單集", "Single"],
            "serial": ["系列", "Series"],
            "onetime": ["單次", "A Single"],
            "everyDay": ["每天", "Every Day"],
            "everyWeek": ["每週", "Every Week"],

            //recorded list
            "videoDuration": ["片長:", "Duration:"],
            "videoSize": ["檔案大小:", "Size:"],
            "usedSpace": ["已用磁碟空間:", "Used:"],
            "totalSize": ["總授權:", "Total Authorized:"],
            "playLastPostion": ["從上次位置播放", "Play from the last position"],
            "BeginPlay": ["從頭開始播放", "Replay"],
            "loading": ["載入中！", "Loading!"],
            "exit": ["退出", "Exit"],
            "replay": ["再播一次", "Replay"],


            //recording list
            "recording_list_title": ["録影 > 我的預約", "PVR > Scheduled List"],
            "start_end_time": ["開始,結束時間", "Start-end time"],
            "cancel_recored": ["取消預約", "Cancel"],
            "detail": ["詳情", "Detail"],
            "recorded_list": ["已錄節目清單", "Recorded List"],
            "recording_prom_info": ["預約節目詳情", "Scheduled Program Detail"],
            "confirm_delete": ["刪除確認", "Deletion Confirmation"],
            "all_channel": ["所有頻道", "All Channels"],
            "delete_recording_item_confirm": ["確認刪除該預約錄影?", "Are you sure to delete the reserved PVR"],

            //recorded list
            "recorded_list_title": ["錄影 > 已錄節目", "PVR > Recorded List"],
            "RecordedProm": ["已錄節目", "Recorded List"],
            "play": ["播放", "Play"],
            "delete": ["刪除", "delete"],
            "recording_list": ["預約錄影清單", "Scheduled List"],
            "delete_recorded_item_confirm": ["確認刪除該錄製節目?", "Are you sure to delete the recording program"],

            //mediaPlayBanner
            "playOrPause": ["播放/暫停", "Play/Pause"],
            "Backward": ["後退", "Backward"],
            "forward": ["前進", "Forward"],
            "Fast_forward": ["倍數前進", "FF"],
            "Fast_backward": ["倍數後退", "FB"],
            "details": ["詳情", "Details"],
            "audio_track": ["音軌", "Audio Track"],
            "leave": ["離開", "LiveTV"],
            "play_again": ["再播一遍", "play again"],
            "play_episode": ["繼續播放下一集", "play episode"],
            "langDlg_title": ["提醒", "Remind"],
            "langDlg_content": ["音軌切換中，請稍後。", "Audio track is switching,wait a moment,please"],
            "Program_details": ["節目詳情", "Program Details"],
            "Information": ["資訊", "Information"],

            //mailbox
            "System_mailbox": ["系統郵箱", "Mailbox"],
            "mailbox_title": ["標題", "Title"],
            "importance": ["重要", "Imp"],
            "ordinary": ["普通", "ordinary"],
            "sum": ["總數", "Mail"],
            "unread": ["未讀", "Unread"],
            "max": ["最多", "Max No."],
            "read": ["閱讀", "Read"],
            "delete_read": ["刪除已讀", "Delete Read"],
            "mailInfo": ["郵件信息", "Mail Information"],
            "mailDlg_title": ["消息", "Remind"],
            "delete_this": ["確認刪除此郵件？", "Are you sure to delete this mail?"],
            "delete_allRead": ["確認刪除所有已讀郵件？", "Are you sure to delete all read mail?"],
            "noCACardDlg": ["未檢測到CA卡，請插入卡后再進入", "CA card was not detected,please insert the card and enter again"],
            "newMailDlg": ["有新的郵件到達，是否立即查看？", "New mail arrives,Will you check it immediately?"],

            //input dialog
            "Enter_New_Password": ["輸入新的密碼", "Input New PIN"],
            "Enter_New_Password_Again": ["重新輸入新的密碼", "Reconfirm new PIN"],
            "Password_Error_Please_Input_Again": ["密碼不正確，請重新輸入", "Password Error,Please Input Again"],
            "Parameter_is_Illegal_Please_Input_Again": ["參數不合法，請重新輸入", "Parameter Is Illegal,Please Input Again"],
            //Personal_Settings Menu
            "Setting": ["設定", "Setting"],
            "Personal_Settings": ["個人化設定", "Setting"],

            "Parent_Child_Channel_Lock": ["親子頻道鎖", "Parental Control"],
            "Personal_Authentication_Code": ["個人認證碼", "Purchase PIN"],
            "Language_And_Messaging_Settings": ["語言及訊息設定", "Language Setting"],
            "Subtitle_Setting": ["字幕設定", "Subtitle Setting"],
            "Subtitle_Setting2": ["字幕設定", "Subtitle"],
            "Screen_And_Sound_Settings": ["螢幕及音效設定", "Video and Audio Setting"],
            "Video_Function": ["錄影功能", "PVR"],
            "Channel_Search": ["搜尋頻道", "Channel Scan"],
            "Network_Settings": ["網路設定", "Network Setting"],
            "System_Information": ["系統資訊", "System Information"],

            //Parent Child Channel Lock
            "Parent_Child_Lock": ["親子鎖", "Parental Control Lock"],
            "Parental_Rating": ["親子鎖", "Parental Rating"],
            "Channel_Lock": ["頻道鎖", "Channel Lock"],
            "Parental_Channel":["頻道鎖", "Parental Channel"],
            "Work_Period_Setting": ["工作時間段設定", "Work Period Setting"],
            "Time_Setting": ["工作時間段設定", "Time Setting"],
            "Modify_Password": ["修改親子鎖密碼", "Change PIN"],
            "Unlimited": ["不限制", "Unlimited"],
            "Adult": ["成人級", "Adult"],
            "Limit": ["限制級", "Restricted"],
            "Counseling_15": ["輔15", "PG 15"],
            "Counseling_12": ["輔12", "PG 12"],
            "Protection": ["保護", "PG"],
            "General": ["普遍(全鎖)", "General"],
            "Unlock": ["解鎖", "Unlock"],
            "Lock": ["上鎖", "Lock"],
            "All_Unlock": ["全部解鎖", "All Unlock"],
            "Unlock_All_Tips": ["將全部頻道鎖解鎖？", "Unlock All Channel Locks?"],
            "Work_Time_Setting": ["工作時間設定", "Working Time Enable"],
            "Begin_Time": ["開始時間", "Start time"],
            "Switch_With_Red": ["以 紅色鍵 開關", "Switch With Red Key"],
            "Save_Sucessful": ["存儲成功", "Save Successfully"],

            "Picture_Language_Display": ["畫面顯示語言", "Screen Language"],
            "Message_Display_Time": ["訊息顯示時間", "Message Display Time"],
            "Traditional_Chinese": ["繁體中文", "繁體中文"],

            "Chinese":["繁體中文","Chinese"],
            "English":["英文","English"],

            "Second": ["秒", "Second"],
            "Open": ["啟動", "Enable"],
            "Close": ["關閉", "Disable"],
            "Open2": ["啟動", "ON"],
            "Close2": ["關閉", "OFF"],

            "Screen_And_Sound": ["螢幕及音效設定", "Screen and Sound Setting"],
            "Screen_Scale": ["螢幕比例", "Aspect Ratio"],
            "Picture": ["畫質", "Video Resolution"],
            "Major_Sound_Language": ["主要聲音語言", "Audio Language"],
            "Dolby_Digital": ["杜比數位", "Dolby "],
            "Automatic": ["自動", "Auto"],
            "Chinese": ["繁體中文", "Chinese"],
            "English": ["English", "English"],
            "Stereo": ["立體聲", "STEREO"],
            "Dolby": ["杜比音效", "DOLBY"],
            "Dual_Channel": ["雙聲道", "Dual Channel"],
            "WiFi_Setting": ["WiFi 設定", "WiFi Setting"],
            "CM_Information": ["CM 資訊", "CM Information"],
            "WiFi_Switch": ["WiFi 開關", "WiFi Switch"],
            "Encryption_Mode": ["加密模式", "Encryption Mode"],
            "Switch_On": ["開啟", "NO"],
            "Switch_Off": ["關閉", "OFF"],
            "Change_Tips": ["請按確認鍵保存更改", "Please Press Ok Key To Save Change"],
            "No_CM_Tips": ["未检测到无线网卡模组，請插入USB無線網卡", "Wireless Card Module Is Not Detected,Please Insert USB Wireless Card"],
            "CM_Mode": ["CM 模式", "CM Mode"],
            "DOCSIS_Status": ["DOCSIS 狀態", "DOCSIS Status"],
            "Already_On_Line": ["已上線", "Already On Line"],
            "Already_Off_Line": ["已下線", "Already OFF Line"],
            "Down_Frequency_Point_Status": ["下行頻點狀態", "Down Frequency Point Status"],
            "Up_Frequency_Point_Status": ["上行頻點狀態", "Up Frequency Point Status"],

            "Normal": ["正常", "Normal"],
            "Very_Weak": ["很弱", "Very Weak"],
            "Commonly": ["一般", "Commonly"],
            "Strong ": ["強", "Strong"],
            "Very_Strong": ["極強", "Very Strong"],
            "Connect_Status": ["連接狀態", "Connection Status"],
            "Security_Type": ["安全類型", "Security Type"],
            "Subnetwork_Mask": ["子網路遮罩", "Subnet Mask"],
            "Communication_Gateway": ["通訊閘道", "Gateway"],
            "DNS_Server": ["網路名稱服務器", "DNS Server"],
            "IP_Address": ["IP 地址", "IP Address"],
            "Signal_Strength": ["訊號強度", "Strength"],
            "Manual_Setting": ["手動設定", "Manual Setting"],

            "Hardware_Version": ["硬體版本", "Hardware Version"],
            "Software_Version": ["軟體版本", "Software Version"],
            "Loader_Version": ["載入器版本", "Loader Version"],
            "Smart_Card_Number": ["智慧卡號碼", "Smart Card Number"],
            "CA_Version": ["CA 版本", "CA Version"],
            "System_Version": ["系統版本", "System Version"],
            "The_Device_Is_In_Place": ["裝置已就緒", "The Device Is Ready"],
            "Frequency": ["頻率", "Frequency"],
            "Frequency2": ["頻率", "Freq"],
            "Progress": ["進度", "Progress"],
            "Searching": ["搜尋中", "Searching"],
            "TV": ["電視", "TV"],
            "Music": ["音樂", "Music"],
            "Information": ["資料", "Information"],
            "Search": ["搜尋", "Search"],
            "Scan": ["搜尋", "Scan"],

            //system setting
            //boot wizard
            "Previous_Step": ["上一步", "Previous Step"],
            "Next": ["下一步", "Next"],
            "Step1": ["步驟一:檢測軟體升級", "Step1 : Upgrade Checking"],
            "Ota": ["OTA狀態:", "OTA Status:"],
            "UpCheck": ["升級檢測中...剩餘 ", "Upgrade testing,there is still "],
            "second": ["秒", "s"],
            "CurSw": ["當前軟體版本:", "Software Version:"],
            "Wait": ["正在搜尋中,請稍後...", "Searching,please wait..."],
            "Step2": ["步驟二:個人化設定", "Step2 : Personalization Configuration"],
            "Language": ["語言", "Language"],
            "Chinese_English": ["繁體中文", "English"],
            "Aspect_ratio": ["螢幕比例", "Screen Ratio"],
            "Auto": ["自動", "Auto"],
            "Video_format": ["影像格式", "Video Format"],
            "set_resolution_tip": ["您的解析度已設定，系統將在10秒內還原設定，確認保留這些設定嗎？", "Do you want to keep this resolution? If not, 10s will restore the previous settings."],
            "Step3": ["步驟三:參數設定", "Step3: Parameters setting"],
            "Symbol_rate": ["符號率", "Symbol"],
            "Step4": ["步驟四:搜尋頻道", "Step4: Network scanning"],
            "Signal": ["訊號", "BER"],
            "OK": ["確認", "Confirm"],
            "Search_Over": ["搜尋完成", "Scan Completed!"],
            "Turn_Main_Tip": ["請按壓\"OK\"鍵進入主頁面", "Please Press \"OK\" To Enter the Main Page"],
            "Turn_Main": ["移至主頁面", "Move To MainMenu"],

            //system setting menu
            "system_setting": ["系統設定", "System Setting"],
            "System_Update": ["系統升級", "System Upgrade"],
            "Search_Channel": ["搜尋頻道", "Channel Scan"],
            "Singal_Check": ["訊號檢測", "Signal Diagnose"],
            "CA_Information": ["CA 資訊", "CA Setting"],
            "Reset_STB": ["重新設定機上盒", "Factory Reset"],
            "Work_Order_Return": ["安裝工單回報", "SMS Installation Report"],
            "Action_Open_QR": ["行動開通 QR", "Mobile Activation QR"],
            "BID_Setting": ["BID 設定", "BID Setting"],
            "app_update": ["九宮格更新", "Refresh TVPortal"],
            "Format_Hard_Disk": ["格式化硬碟", "HDD Formatting"],
            "HDDNoready": ["裝置未就緒（代碼:PVR002）", "Device is not ready(CODE:PVR002)"],
            "HDDnopair": ["裝置未配對（代碼:PVR003）", "Device is not available"],
            "HDDready": ["裝置已就緒", "Available"],
            "Noready": ["功能暫不支持", "Not supported the function"],
            "Debug_Information": ["Debug 設定", "Debug Configuration"],
            "CPU_Info": ["DeBug 設定", "CPU/MEM Info"],
            "VBM_Switch": ["VBM 開關", "VBM_Switch"],

            //scan channel
            "System_Setting": ["系統設定", "System Setting"],
            "Network_Search": ["網絡搜尋", "Network Search"],
            "Manual_Search": ["手動搜尋", "Manual Search"],
            "Move_Focus_Right": ["向右移動焦點", "Right"],
            "Move_Focus_Left": ["向左移動焦點", "Back"],
            "Up_Page": ["上一頁", "Back"],
            "Move_to_Right": ["向右移動焦點", "Change focus to the right"],


            //system_update
            "USB_Update": ["USB升級", "USB Upgrade"],
            "OTA_Update": ["OTA升級", "OTA Upgrade"],

            //network_setting

            "STB_Mode": ["STB模式", "STB Mode"],
            "Restart_STB_Confirm": ["重啟機上盒確認", "Restart STB Confirmation"],
            "Please_Confirm_Restart_STB": ["請確認是否重啟機上盒使新設定生效？", "Are you sure to restart the STB to bring new setting into effect?"],
            "IP_Information": ["IP 資訊", "IP Information"],
            "DHCP_Setting": ["DHCP 設定", "DHCP Setting"],
            "Wired_Device": ["連線設備", "Wired Device"],
            "Subnet_Mask": ["子網路遮罩", "Subnet Mask"],
            "Default_Gateway": ["預設閘道", "Default Gateway"],
            "Main_DNS": ["主要", "Main DNS"],
            "Second_DNS": ["次要", "Second DNS"],
            "Subnet_Setting": ["子網域設定", "Subnet Setting"],
            "Switch": ["開關", "Switch"],
            "Name": ["名稱", "Name"],
            "Encrypt_Mode": ["加密模式", "Encrypt Mode"],
            "Input_Password": ["輸入密碼", "Enter PIN"],
            "New_Password": ["新密碼", "New Password"],
            "Password": ["密碼", "PIN"],
            "Confirm_Password": ["確認密碼", "Confirm Password"],
            "Select": ["選擇", "Select"],
            "Display_Password": ["顯示密碼", "Display Password"],
            "Please_Input_Password": ["請輸入密碼", "Please Input Password"],
            "Please_Input_New_Password": ["請輸新入密碼", "Please Input New Password"],
            "Please_Input_Confirm_Password": ["請輸入確認密碼", "Please Input Confirm New Password"],
            "New_And_Confirm_Password_Is_Different": ["新密碼與確認密碼不統一", "New And Confirm Password Is Different"],
            "Change_Password_Failed": ["修改密碼失敗", "Change Password Failed"],
            "Tips": ["提示", "Messages"],
            "Address": ["地址", "Address"],
            "Save": ["儲存", "Save"],
            "Wired_Network": ["有線網絡", "Ethernet"],
            "Wireless_Networks": ["無線網路", "Wireless Networks"],
            "IP_Acquisition_Mode": ["IP 取得方式", "IP Acquisition"],
            "Dynamic_IP_Configuration": ["動態IP配置", "Dynamic IP Configuration"],
            "Static_IP_Configuration": ["靜態IP配置", "Static IP Configuration"],
            "Local_IP": ["本地IP", "IP Address"],
            "Modify_Settings": ["修改設定", "Update Setting"],
            "Detection": ["檢測", "Diagnose"],

            "Network_Setup_Confirmation": ["網絡設定確認", "Network setup confirmation"],
            "Switch_To_Static_IP_Tips": ["確認將網絡狀態設定為靜態IP設定？", "Are you  sure to set network status to a static IP configuration?"],
            "Switch_To_Dynamic_IP_Tips": ["確認將網絡狀態設定為動態IP設定？", "Are you  sure to set network status to a dynamic IP configuration?"],
            "Setting_Success": ["設定成功", "Setting_Success"],
            "Confirm_Settings": ["確認設定", "Confirm Settings"],
            "Software_Keyboard": ["熒幕小鍵盤", "Software_Keyboard"],
            "Upload": ["上行", "Upload"],
            "Download": ["下行", "Download"],
            "Ranging": ["測距", "Ranging"],
            "Online": ["在線", "Online"],
            "Passageway": ["通道", "Passageway"],
            "Version": ["版本", "Version"],
            "Current_Time": ["目前時間", "Current Time"],

            "Card_Password_Change": ["卡密碼修改", "Change CA PIN"],
            "STB_Card_Pairing": ["機卡配對", "SC Pairing"],
            "Operator_Information": ["營運商訊息", "Operator Info"],
            "Card_Information": ["智慧卡訊息", "CA Info"],
            "Card_Update_Information": ["智慧卡升級訊息", "SC Update Info"],
            "STB_Card_Pairing_Status": ["機卡配對狀態", "SC Pairing Status"],
            "Serial_Number": ["序號", "Serial Number"],
            "Operator_ID": ["營運商 ID", "Operator ID"],
            "Operator_Name": ["營運商名稱", "Operator Name"],
            "Authorization_Information": ["授權信息", "Product"],
            "E_Wallet": ["電子錢包", "E-Slot"],
            "Characteristic_Value": ["特徵值", "EigenValue"],
            "Program_Authorization_ID": ["節目授權ID", "Product ID"],
            "Video": ["錄影", "PVR"],
            "Video1": ["錄影", "Record"],
            "End_Time": ["結束時間", "End time"],
            "Authorization_Information_Quantity": ["授權信息數量", "Product Info Num"],
            "Wallet_ID": ["錢包ID", "Wallet ID"],
            "Credit_Points": ["信用點數", "Credit Points"],
            "Spent_Points": ["已花點數", "Spent Points"],
            "Update_Time": ["升級時間", "Update Time"],
            "Update_Status": ["升級狀態", "Update state"],
            "Back": ["返回", "Back"],
            "Verify_Factory_Restored": ["確認恢復出廠預設值？", "OK to restore the factory default settings?"],
            "Status": ["狀態", "Status"],
            "Restored_Tips": ["恢復出廠預設值並系統重新開機中...", "Restore Factory Defaults And Reboot The System..."],
            "Is_Paired": ["智慧卡與目前機上盒配對", "Paired with current STB"],
            "Invalid_card": ["無效卡", "Invalid card"],
            "Other_Paired": ["智慧卡與其他機上盒配對", "The card is paired with other STB"],
            "No_Paired": ["智慧卡沒有與任何機上盒配對", "The card is not paired with any STB"],

            "Native_Status": ["本機狀態", "Native Status"],
            "Authorization_Status": ["授權狀態", "Authorization Status"],
            "Corresponding_Master_Card": ["對應母機卡號", "Corresponding Master Card"],
            "Master_Card": ["母卡", "Master Card"],
            "Authorized": ["已授權", "Authorized"],
            "Sub_Card": ["子卡", "Sub Card"],
            "Unauthorized": ["未授權", "Unauthorized"],

            "Company_Alias": ["公司別", "SO ID"],
            "Work_Order_Simple_Code": ["工單簡碼", "IVR Code"],
            "Work_Order_Query": ["工單查詢", "Query IVR"],
            "Work_Order_Information": ["工單訊息", "IVR Information"],
            "Return_Value": ["回傳值", "Return Value"],
            "Job_Information": ["作業訊息", "Job Information"],
            "Work_Order_Full_Code": ["工單全碼", "IVR Full Code"],
            "Installed_Class": ["裝機類別", "Installed Class"],
            "Cycle_Cost": ["週期費用", "Cycle Cost"],
            "Engineering": ["工程人員", "Engineering"],
            "Phone_Number": ["手機號碼", "Phone Number"],
            "STB_Serial_Number": ["機上盒序號", "No."],
            "STB_Serial_Number2": ["機上盒序號", "STB ID"],
            "Build_Hard_Disk": ["是否建硬碟", "Build Hard Disk"],
            "HDD_Serial_Number": ["硬碟序號", "HDD Serial Number"],
            "Submit": ["提交", "Submit"],
            "STB_Authorized": ["機上盒授權開通", "STB Authorized"],
            "STB_IS_Authorizing": ["機上盒授權開通中...", "STB IS Authorizing"],
            "Authorization_Result": ["機上盒授權開通結果", "Authorization Result"],
            "Authorization_Successful": ["機上盒授權開通成功", "Authorization Successful"],
            "Complete": ["完成", "Complete"],
            "Engineering_Change": ["工程人員變更", "Engineering Change"],
            "Engineering_Change_Result": ["變更工程人員結果", "Engineering Change Result"],
            "Change_Failed": ["變更失敗", "Change Failed"],
            "Change_Successful": ["變更成功", "Change Successfully"],
            "DTV_Bidirectional_Module_Return": ["DTV雙向模組回填", "DTV Two-Way Module Report"],
            "Query_DTV_Bidirectional_Module": ["查詢DTV雙向模組", "Query DTV Bidirectional Module"],
            "Query_DTV_Bidirectional_Module_Result": ["查詢DTV雙向模組結果", "Query DTV Bidirectional Module Result"],
            "Read_Return_CM_MAC": ["讀取/回傳 CM MAC 位址", "Read/Return CM MAC"],
            "MAC_Address": ["MAC 位址", "MAC Address"],
            "Pass_Back_Failed": ["回傳結果失敗", "Pass Back Failed"],
            "Reading_Please_Wait": ["讀取中...(請稍候)", "Reading...(Please Wait)"],
            "Read_Return_DTV_Result": ["讀取/回傳 DTV雙向模組結果", "Read/Return DTV Bidirectional Module Result"],
            "Function_Call_Successful": ["功能呼叫成功", "Call Function successfully"],
            "Pass_Back": ["回傳", "Pass Back"],

            "Open_Status": ["開通狀態", "Activation Status"],
            "Not_Opened": ["未開通", "Not Activated"],
            "Already_Opened": ["已開通", "Activated"],
            "Correction_Level": ["校正等級", "Correction Level"],
            "QRCode_Content": ["QR條碼內容", "QR barcode content"],
            "Please_Confirm_Company_Alias": ["請確認[公司別]", "Please Confirm the below[SO ID]"],
            "Low": ["低", "Low"],
            "Middle": ["中", "Middle"],
            "High": ["高", "High"],
            "Save_And_Search": ["儲存并搜尋", "Save And Search"],
            "Current": ["當前", "Current"],

            "update_tips": ["升級提示", "Update Information"],
            "update_text": ["檢測到有新的軟體版本，是否升級？", "A new version of the software is detected. Whether upgrade it?"],

            "Full_Format": ["完整格式化", "Normal Format"],
            "Low_Level_Format": ["低階格式化", "Low-level Format"],
            "Formatting": ["正在格式化硬碟,請稍等", "formatting hard disk,please wait a moment"],
            "Please_Input_System_Password": ["請輸入工程密碼", "Please Input Engineer PIN"],
            "Please_Input_Parent_Password": ["請輸入親子鎖密碼", "Please Input Parental PIN"],
            "Please_Input_Persional_Password": ["請輸入個人認證碼", "Please Input Personal Password"],
            "Save_Error": ["儲存失败", "Save Failed"],
            "Error_format": ["參數錯誤格式請檢查！", "Parameter format error, please check it!"],
            "Passwords_Are_Different": ["密碼不一樣", "Passwords Are Different"],
            "Password_Empty": ["密碼為空", "Password is Empty"],
            "Password_Must_Be_4_Digits": ["密碼為4位", "Password Must Be 4 Digits"],
            "Password_Change_Sucessful": ["密碼修改成功", "Password Change Successfully"],
            "Work_Order_Result_Tips": ["查詢工單資訊結果", "Query IVR Information Result"],
            "STB_Work_Order_Inquiry": ["機上盒工單查詢中...", "STB IVR Inquiry..."],
            "Query_Failed": ["查詢失敗", "Query Failed"],
            "CrmId_Or_WorkNo_Is_Empty": ["公司別或工單簡碼不能為空", "CrmId Or IVRNo. Can't Be Empty"],
            "Parameter_MobilePhone_Is_Illegal": ["參數值MobilePhone不合法", "Parameter MobilePhone Is Illegal"],
            "Request_Timeout": ["請求超時", "Request Timeout"],
            "Resolution_Setting": ["解析度設定", "Resolution Setting"],
            "Change_Tips_Before": ["您的解析度已經確定，系統將在", "Your resolution has been determined, the system will be"],
            "Change_Tips_After": ["秒內還原設定，確認保留這些設定么？", "seconds to restore the settings, are you sure to retain these settings?"],

            "AppUpdateContent": ["請按下OK確認與APP伺服器進行同步", "OK to Start Synchronizing with App Server"],
            "AppUpdateFail": ["APP伺服器同步失敗", "App server sync failed"],
            "AppUpdateSuccess": ["APP伺服器同步更新完成", "App server sync update successfully"],
            "AppUpdating": ["與APP伺服器進行同步中,請稍等", "It is syncing with App server,please wait a moment"],
            "EdollarFail": ["無法透過綫上訂購本頻道，請聯繫客服中心（代碼：E027）", "Can not order current channel,please contact customer center(code:E027)"],
            "NOOTASOFTWARE": ["沒有發現OTA升級軟體", "Can not find OTA new software"],
            "NOUSB": ["沒有發現USB設備", "Can not find USB device"],
            "NOUSBSOFTWARE": ["沒有發現USB升級軟體", "Can not find USB new software"],
        };
}

LpInit();

