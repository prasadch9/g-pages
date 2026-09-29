import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './nurseriesFields';

export default function NurseriesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
