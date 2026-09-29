import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './interiorsDecorationsFields';

export default function InteriorsDecorationsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
