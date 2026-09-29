import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './partyZonesFields';

export default function PartyZonesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
