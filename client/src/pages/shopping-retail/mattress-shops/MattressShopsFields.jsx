import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './mattressShopsFields';

export default function MattressShopsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
