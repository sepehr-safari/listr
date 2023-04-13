import { Publish } from '@/components';

const Edit = ({ params }: { params: { address: string } }) => {
  return <Publish address={params.address} />;
};

export default Edit;
