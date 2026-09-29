import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './agenciesFields';

export default function AgenciesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
