import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './trustsFields';

export default function TrustsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
