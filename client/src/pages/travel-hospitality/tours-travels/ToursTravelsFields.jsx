import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './toursTravelsFields';

export default function ToursTravelsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
