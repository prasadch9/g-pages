import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './smallScaleIndustriesFields';

export default function SmallScaleIndustriesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
