import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './beautyParloursFields';

export default function BeautyParloursFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
