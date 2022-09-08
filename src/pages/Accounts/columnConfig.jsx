import AddressLink from "../../components/AddressLink";

export default ({ isMobile, preTotal }) => {
  return [
    {
      title: "Rank",
      dataIndex: "id",
      width: 186,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: "Address",
      dataIndex: "owner",
      width: 320,
      ellipsis: true,
      render: (address) => <AddressLink address={address} />,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: 300,
      render(balance, record) {
        return `${Number(balance).toLocaleString()} ${record.symbol}`;
      },
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      width: 182,
    },
    {
      title: "Transfers",
      dataIndex: "count",
      width: 100,
    },
  ];
};
