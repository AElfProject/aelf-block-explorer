import React from "react";
import QRCode from "qrcode.react";

import "./QrCode.styles.less";

export default function QrCode({ value }) {
  return (
    <div className="qr-code">
      <QRCode
        value={value}
        style={{
          height: 148,
          width: 148,
        }}
      />
      <p>{value}</p>
    </div>
  );
}
