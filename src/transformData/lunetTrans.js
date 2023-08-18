const lunetTransformData = (lunet) => {
  const keys = lunet[1];
  const data = lunet.slice(2);
  const transformed = data.map((item) => {
    const obj = {
      Date: item.A,
      Day: item.B,
      FIT: {
        Date: item.A,
        Day: item.B,
        Rms: item.C,
        Ratio: item.D,
        ADR: item.E,
        Revenue: item.F,
      },
      Group: {
        Date: item.A,
        Day: item.B,
        Rms: item.H,
        Ratio: item.I,
        ADR: item.J,
        Revenue: item.K,
      },
      Total: {
        Date: item.A,
        Day: item.B,
        Rms: item.O,
        Ratio: 100, // Assuming the Ratio is always 100 for the Total
        ADR: item.Q,
        RevPAR: item.R,
        Revenue: item.S,
      },
    };
    return obj;
  });

  return transformed;
};

module.exports = lunetTransformData;
