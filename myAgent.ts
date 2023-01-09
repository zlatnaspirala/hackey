import { Web } from "sip.js";
import { getButton, getE, getVideo } from "./scripts/utils";

const domain = "sipjs.onsip.com";
export const webSocketServerAdd = "wss://edge.sip.onsip.com";
import { Inviter, SessionState, UserAgent } from "sip.js";

// Create user agent instance (caller)
const userAgent = new UserAgent({
  uri: UserAgent.makeURI(`sip:alice@${domain}`),
  transportOptions: {
    server: webSocketServerAdd
  }
});

// Connect the user agent
userAgent.start().then(() => {

  // Set target destination (callee)
  const target = UserAgent.makeURI(`sip:bob@${domain}`);
  if (!target) {
    throw new Error("Failed to create target URI.");
  }

  // Create a user agent client to establish a session
  const inviter = new Inviter(userAgent, target, {
    sessionDescriptionHandlerOptions: {
      constraints: { audio: false, video: true }
    }
  });

  // Handle outgoing session state changes
  inviter.stateChange.addListener((newState) => {
    switch (newState) {
      case SessionState.Establishing:
        // Session is establishing
        break;
      case SessionState.Established:
        // Session has been established
        break;
      case SessionState.Terminated:
        // Session has terminated
        break;
      default:
        break;
    }
  });

  // Send initial INVITE request
  inviter.invite()
    .then(() => {
      // INVITE sent
      console.log("INVITE SEND")
    })
    .catch((error: Error) => {
      // INVITE did not send
      console.log("INVITE DONT SEND")
    });

});