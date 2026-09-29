import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './trainingInstitutesFields';

export default function TrainingInstitutesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
