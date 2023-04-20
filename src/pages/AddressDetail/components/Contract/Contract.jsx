// eslint-disable-next-line no-use-before-define
import React from "react";
import clsx from "clsx";
import useMobile from "../../../../hooks/useMobile";
import Reader from "../Reader/Reader";
import SaveAsFile from "../../../../components/Save";

import "./Contract.styles.less";
import { validateVersion } from "../../../../utils/regExps";

export default function Contract({
  contractInfo = { contractName: "-", files: "", address: "-", version: "-" },
  codeHash,
  history,
  isShow,
}) {
  const isMobile = useMobile();
  const version = codeHash
    ? history?.find((i) => i.codeHash === codeHash)?.version
    : contractInfo.version;
  return (
    <div className={clsx("contract-pane", isMobile && "mobile")}>
      <section className="contract-info">
        <p>
          <span className="label">Contract Name</span>
          <span className="value">
            {contractInfo.contractName === "-1"
              ? "-"
              : contractInfo.contractName}
          </span>
        </p>
        <p>
          <span className="label">Compiler Version</span>
          <span className="value">
            {validateVersion(version) ? version : "-"}
          </span>
        </p>
        <p>
          <span className="label">
            Contract Info
            <SaveAsFile
              files={JSON.parse(contractInfo.files || "[]")}
              fileName={contractInfo.address || "contract"}
            />
          </span>
        </p>
      </section>
      <section className="contract-code">
        <Reader contractInfo={contractInfo} isShow={isShow} />
      </section>
    </div>
  );
}
