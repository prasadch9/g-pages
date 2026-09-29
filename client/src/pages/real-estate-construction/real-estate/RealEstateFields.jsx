import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './realEstateFields';

export default function RealEstateFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
