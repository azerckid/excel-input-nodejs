const lunetAccountTransformData = (data) => {
  // Use slice(2) to skip the first two metadata rows
  return data.slice(2).map((entry) => {
    return {
      Account: entry.A,
      AccountName: entry.B,
      TotalRevenue: entry.C,
      RoomRevenue: entry.D,
      ADR: entry.E,
      RoomRevenue: {
        FIT: entry.F,
        Group: entry.G,
      },
      Rooms: {
        Nights: entry.H,
        NoShow: entry.I,
        Cancel: entry.J,
        Booking: entry.K,
      },
      Guests: entry.L,
      Food: entry.M,
      Beverage: entry.N,
      Other: entry.O,
      SVC: entry.P,
      Tax: entry.Q,
    };
  });
};

module.exports = lunetAccountTransformData;
