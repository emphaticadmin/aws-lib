
exports.init = init;

function init(genericAWSClient) {
  return createSimpleEmailServiceClient;

  function createSimpleEmailServiceClient(accessKeyId, secretAccessKey, options) {
    options = options || {};
    var client = genericAWSClient({
      host: options.host || "email.us-east-1.amazonaws.com",
      path: options.path || "/",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      secure: options.secure,
      signHeader: true
    });

    return {
      client: client,
      call: call
    };

    function call(action, query, callback) {
      query["Action"] = action
      if(process.env.EMPHATIC_ENVIRONMENT !== 'prod') {
        query['Destination.ToAddresses.member.1'] = 'travis@emphatic.co';
        if(query['Destination.ToAddresses.member.2']) {
          delete query['Destination.ToAddresses.member.2'];
        }  
      }  
 
      return client.call(action, query, callback);
    }
  }
}
