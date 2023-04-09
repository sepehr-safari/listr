const ListView = ({ data }: { data: any }) => {
  return (
    <li className="">
      {Object.values<string>(data)?.map((value, index) => {
        return (
          <p className={index === 0 ? 'font-bold' : ''} key={index}>
            {value}
          </p>
        );
      })}
    </li>
  );
};

export default ListView;
