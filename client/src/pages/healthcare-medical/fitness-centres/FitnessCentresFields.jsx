import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './fitnessCentresFields';

export default function FitnessCentresFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
