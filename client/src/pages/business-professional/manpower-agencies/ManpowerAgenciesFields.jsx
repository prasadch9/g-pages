import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './manpowerAgenciesFields';

export default function ManpowerAgenciesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
