// Shared mock data reflecting realistic scale:
// 1 Program = 40 PPs, ~20 Coaches, 1 Coach = 2 PPs
// Coaches grouped into ~5 groups, each with a Coach Group Leader

export interface MockCoach {
  id: string;
  name: string;
  email: string;
}

export interface MockParticipant {
  id: string;
  name: string;
  mobile: string;
  coachId: string;
}

export interface MockGroup {
  id: string;
  name: string;
  leaderId: string;
  coachIds: string[];
}

export const COACHES: MockCoach[] = [
  { id: "C001", name: "Somchai T.", email: "somchai@example.com" },
  { id: "C002", name: "Anurak P.", email: "anurak@example.com" },
  { id: "C003", name: "Kanya S.", email: "kanya@example.com" },
  { id: "C004", name: "Preecha L.", email: "preecha@example.com" },
  { id: "C005", name: "Narong W.", email: "narong@example.com" },
  { id: "C006", name: "Suda M.", email: "suda@example.com" },
  { id: "C007", name: "Wichai B.", email: "wichai@example.com" },
  { id: "C008", name: "Thanya K.", email: "thanya@example.com" },
  { id: "C009", name: "Pongsakorn D.", email: "pongsakorn@example.com" },
  { id: "C010", name: "Rattana J.", email: "rattana@example.com" },
  { id: "C011", name: "Chaiwat R.", email: "chaiwat@example.com" },
  { id: "C012", name: "Nattaya V.", email: "nattaya@example.com" },
  { id: "C013", name: "Sakda A.", email: "sakda@example.com" },
  { id: "C014", name: "Apinya N.", email: "apinya@example.com" },
  { id: "C015", name: "Krit F.", email: "krit@example.com" },
  { id: "C016", name: "Supansa G.", email: "supansa@example.com" },
  { id: "C017", name: "Tanawat H.", email: "tanawat@example.com" },
  { id: "C018", name: "Jirayu C.", email: "jirayu@example.com" },
  { id: "C019", name: "Patcharee O.", email: "patcharee@example.com" },
  { id: "C020", name: "Montree E.", email: "montree@example.com" },
];

export const PARTICIPANTS: MockParticipant[] = [
  { id: "PP001", name: "Areeya K.", mobile: "081-111-0001", coachId: "C001" },
  { id: "PP002", name: "Boonsri R.", mobile: "081-111-0002", coachId: "C001" },
  { id: "PP003", name: "Chalerm N.", mobile: "081-111-0003", coachId: "C002" },
  { id: "PP004", name: "Duangjai F.", mobile: "081-111-0004", coachId: "C002" },
  { id: "PP005", name: "Ekachai V.", mobile: "081-111-0005", coachId: "C003" },
  { id: "PP006", name: "Fongchan B.", mobile: "081-111-0006", coachId: "C003" },
  { id: "PP007", name: "Gamon S.", mobile: "081-111-0007", coachId: "C004" },
  { id: "PP008", name: "Hansa D.", mobile: "081-111-0008", coachId: "C004" },
  { id: "PP009", name: "Issara J.", mobile: "081-111-0009", coachId: "C005" },
  { id: "PP010", name: "Jutarat P.", mobile: "081-111-0010", coachId: "C005" },
  { id: "PP011", name: "Kamol T.", mobile: "081-111-0011", coachId: "C006" },
  { id: "PP012", name: "Lalita W.", mobile: "081-111-0012", coachId: "C006" },
  { id: "PP013", name: "Manee R.", mobile: "081-111-0013", coachId: "C007" },
  { id: "PP014", name: "Noppadon S.", mobile: "081-111-0014", coachId: "C007" },
  { id: "PP015", name: "Ornuma C.", mobile: "081-111-0015", coachId: "C008" },
  { id: "PP016", name: "Piyapong L.", mobile: "081-111-0016", coachId: "C008" },
  { id: "PP017", name: "Ratchanee M.", mobile: "081-111-0017", coachId: "C009" },
  { id: "PP018", name: "Siriporn A.", mobile: "081-111-0018", coachId: "C009" },
  { id: "PP019", name: "Thanida B.", mobile: "081-111-0019", coachId: "C010" },
  { id: "PP020", name: "Uthit D.", mobile: "081-111-0020", coachId: "C010" },
  { id: "PP021", name: "Varunee F.", mobile: "081-111-0021", coachId: "C011" },
  { id: "PP022", name: "Waraporn G.", mobile: "081-111-0022", coachId: "C011" },
  { id: "PP023", name: "Yingyot H.", mobile: "081-111-0023", coachId: "C012" },
  { id: "PP024", name: "Anat J.", mobile: "081-111-0024", coachId: "C012" },
  { id: "PP025", name: "Boonlert K.", mobile: "081-111-0025", coachId: "C013" },
  { id: "PP026", name: "Channarong L.", mobile: "081-111-0026", coachId: "C013" },
  { id: "PP027", name: "Dusit M.", mobile: "081-111-0027", coachId: "C014" },
  { id: "PP028", name: "Ekkachai N.", mobile: "081-111-0028", coachId: "C014" },
  { id: "PP029", name: "Fonthip O.", mobile: "081-111-0029", coachId: "C015" },
  { id: "PP030", name: "Gitsada P.", mobile: "081-111-0030", coachId: "C015" },
  { id: "PP031", name: "Hathai R.", mobile: "081-111-0031", coachId: "C016" },
  { id: "PP032", name: "Intira S.", mobile: "081-111-0032", coachId: "C016" },
  { id: "PP033", name: "Jaturong T.", mobile: "081-111-0033", coachId: "C017" },
  { id: "PP034", name: "Kanokwan U.", mobile: "081-111-0034", coachId: "C017" },
  { id: "PP035", name: "Laddawan V.", mobile: "081-111-0035", coachId: "C018" },
  { id: "PP036", name: "Montira W.", mobile: "081-111-0036", coachId: "C018" },
  { id: "PP037", name: "Nitipat Y.", mobile: "081-111-0037", coachId: "C019" },
  { id: "PP038", name: "Oraphin Z.", mobile: "081-111-0038", coachId: "C019" },
  { id: "PP039", name: "Prapai A.", mobile: "081-111-0039", coachId: "C020" },
  { id: "PP040", name: "Ratree B.", mobile: "081-111-0040", coachId: "C020" },
];

export const DEFAULT_GROUPS: MockGroup[] = [
  { id: "G1", name: "Alpha Team", leaderId: "C001", coachIds: ["C001", "C002", "C003", "C004"] },
  { id: "G2", name: "Beta Team", leaderId: "C005", coachIds: ["C005", "C006", "C007", "C008"] },
  { id: "G3", name: "Gamma Team", leaderId: "C009", coachIds: ["C009", "C010", "C011", "C012"] },
  { id: "G4", name: "Delta Team", leaderId: "C013", coachIds: ["C013", "C014", "C015", "C016"] },
  { id: "G5", name: "Epsilon Team", leaderId: "C017", coachIds: ["C017", "C018", "C019", "C020"] },
];

export function getCoachPPs(coachId: string): MockParticipant[] {
  return PARTICIPANTS.filter((p) => p.coachId === coachId);
}

export function getCoachById(coachId: string): MockCoach | undefined {
  return COACHES.find((c) => c.id === coachId);
}
