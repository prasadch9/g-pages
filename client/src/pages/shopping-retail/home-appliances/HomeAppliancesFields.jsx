import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './homeAppliancesFields';

export default function HomeAppliancesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
