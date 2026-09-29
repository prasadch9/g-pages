import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './tilesShopsFields';

export default function TilesShopsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
