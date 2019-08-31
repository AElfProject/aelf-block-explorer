// VotingRegisterInput {
//   google.protobuf.Timestamp start_timestamp = 1;
//   google.protobuf.Timestamp end_timestamp = 2;
//   string accepted_currency = 3;
//   bool is_lock_token = 4;
//   sint64 total_snapshot_number = 5;
//   repeated string options = 6;
// }

const startTimestamp = { 
  created: Date.now()
};
const endTimestamp = { 
  created: new Date('2019-9-10')
};
const acceptedCurrency = "10000";
const isLockToken = true;
const totalSnapshotNumber = 100;
const options = [];

console.log(JSON.stringify({
  startTimestamp,
  endTimestamp,
  acceptedCurrency,
  isLockToken,
  totalSnapshotNumber,
  options
}))