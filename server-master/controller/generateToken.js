// Agora
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const appID = "105363077c3c402c8dc5c4839680fd22";
const appCertificate = "47caf2469f424679ad7a0e3eb0f4d8d2";
const role = RtcRole.PUBLISHER;

const generateToken = async (channelName) => {
  // Build token with uid
  console.log("channel name" +channelName);
  const tokenA = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    0,
    role
  );
  return tokenA;
};

module.exports = {
  generateToken,
};
