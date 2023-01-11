/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserAgentOptions, Web } from "sip.js";
import { SimpleUserDelegate } from "sip.js/lib/platform/web/simple-user/simple-user-delegate";
import { getButton, getE, getVideo, LocalStorageMemory } from "./scripts/utils";

(window as any).getE = getE;

export class Hackey {

  domain="159.89.8.40";
  webSocketServer="wss://159.89.8.40:5060";
  iamUser="alice";
  getE = getE;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  construct = ()=>{};

  mem = new LocalStorageMemory();
  constructor () {
    console.info('Hackey running...', Web);

    if (this.mem.load('iamUser') == null) {
      // first time
      this.mem.save('iamUser', this.iamUser);
    } else {
      // load username
      this .iamUser = this.mem.load('iamUser');
    }

    this.construct = () => {
    
      const delegate: SimpleUserDelegate={
        onCallReceived: async () => {
          console.log('Incoming Call!');
          await simpleUser2.answer();
        }
      };
      // Options for SimpleUser
      const options: Web.SimpleUserOptions={
        // userAgentOptions: userAgentOptions,
        aor: `sip:${this.iamUser}@${this.domain}`,
        media: {
          constraints: { audio: false, video: true },
          local: {
            video: getVideo("videoLocalAlice")
          },
          remote: {
            video: getVideo("videoRemoteAlice")
          }
        }
      };
  
      const options2: Web.SimpleUserOptions={
        aor: `sip:zlatnaspirala@${this.domain}`,
        media: {
          constraints: { audio: false, video: true },
          local: {
            video: getVideo("videoLocalBob")
          },
          remote: {
            video: getVideo("videoRemoteBob")
          }
        },
        delegate: delegate
      };
  
      // Construct a SimpleUser instance
      const simpleUser=new Web.SimpleUser(this.webSocketServer, options);
      const simpleUser2=new Web.SimpleUser(this.webSocketServer, options2);
  
      simpleUser.connect()
        .then(() => {
          console.info("status: sip server connected.");
          (getE('callIdList') as HTMLInputElement).disabled=false;
          (getButton('connectUser')).disabled=true;
          (getButton('registerUser')).disabled=false;
  
          simpleUser.register().then(() => {
  
            console.info("status: registered.");
            getButton('registerUser').disabled=true;
            getButton('callBtn').disabled=false;
            getButton('callBtn').classList.add('cooliano');
            getButton('callBtn').addEventListener('click', (e) => {
  
              console.log(">>>>"+(getE('callIdList') as HTMLSelectElement).selectedOptions[0].innerText)
              console.log(">>>>"+(getE('callIdList') as HTMLSelectElement).selectedIndex)
              const emailLocal=(getE('callIdList') as HTMLSelectElement).selectedOptions[0].innerText;
  
              const curAddress=`sip:${emailLocal}`;
              // const curAddress = `sip:bob@${domain}`;
              simpleUser.call(curAddress, undefined, {
                requestDelegate: {
                  onAccept: (e) => {
                    console.info(`status: ${(e as any).message.from.uri.normal.user} INVITE accepted from ${(e as any).message.to.uri.normal.user}`);
                    getButton('hangupBtn').disabled=false;
                    (getButton('hangupBtn')).addEventListener('click', () => {
                      //
  
                      simpleUser.hangup().then(() => {
                        console.log("just test hangup")
                      })
                    })
                  },
                  onReject: (response) => {
                    console.info(`status: INVITE rejected`);
                    let message=`Session invitation to  rejected.\n`;
                    message+=`Reason: ${response.message.reasonPhrase}\n`;
                    alert(message);
                  }
                },
                withoutSdp: false
              })
                .catch((error: Error) => {
                  console.error(`error: failed to begin session`, error);
                  alert(` Failed to begin session.\n`+error);
                });
            })
  
          }).catch((error: Error) => {
            console.error("error in registration:", error);
          });
  
        }).catch((error: Error) => {
          console.error("error in connection:", error);
        });
  
      simpleUser2.connect()
        .then(() => {
          simpleUser2.register().then(() => {
            console.log("Nice reg bob");
          }).catch((error: Error) => {
            console.log("Error in registration:", error);
          });
        }).catch((error: Error) => {
          console.log("Error:", error);
        });
  
        getE('changeUsername').addEventListener("click", (e) => {
          console.log('save new username.');
          if ((getE('me') as HTMLInputElement).value != '') {
             this.iamUser = (getE('me') as HTMLInputElement).value;
             this.mem.save('iamUser', this.iamUser);
             simpleUser.unregister().then(()=>{
              // register new username
              this.construct();
             });
          }
        });
  
      getE('addContactBtn').addEventListener("click", function(e) {
        if ((getE('newContact') as HTMLInputElement).value != '') {
          const newContactOpt=document.createElement('option');
          newContactOpt.innerText = (getE('newContact') as HTMLInputElement).value;
          getE('callIdList').appendChild(newContactOpt);
        }
      });
  
    };

    this.construct();
  }


}


const APPLICATION = new Hackey();

console.log(APPLICATION);