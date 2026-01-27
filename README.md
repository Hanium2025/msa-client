📱 PIKIE : MSA 기반 유아용품 중고거래 플랫폼 (Client)
과학기술정보통신부 ICT 멘토링(한이음) 산학 협력 프로젝트 React Native를 활용한 크로스 플랫폼 앱 개발 및 MSA 통신 최적화

📌 프로젝트 개요
PIKIE는 마이크로서비스 아키텍처(MSA)를 기반으로 설계된 유아용품 특화 중고거래 플랫폼입니다. 프론트엔드 팀은 복잡한 마이크로서비스 환경에서 gRPC 통신 효율을 극대화하고, 아토믹 디자인 패턴을 통해 유지보수가 용이한 모바일 인터페이스를 구축하는 데 집중하고 있습니다.

🛠 Client Tech Stack
Framework: React Native (Expo Router)

Language: TypeScript

State Management: Zustand

Styling: Styled-Components

Communication: gRPC + Protocol Buffers (BFF 패턴 적용 고려)

🧩 기술적 지향점 및 협업 (Front-end)
1. 🏗️ 아키텍처 및 시스템 설계 참여
이벤트 스토밍: 도메인 전문가 및 백엔드 개발자와 함께 서비스 단위를 분리하고, 프론트엔드에서 필요한 데이터 요구사항을 정의했습니다.

MSA 대응 설계: API Gateway를 통한 서비스 접근 및 gRPC 기반의 고성능 데이터 통신 구조를 이해하고 클라이언트 측 인터페이스를 설계했습니다.

2. 🎨 디자인 시스템 및 컴포넌트 설계
Atomic Design Pattern: 원자(Atom) 단위의 컴포넌트 설계를 통해 UI 재사용성을 극대화하고 디자인 일관성을 유지합니다.

Expo Router 기반 홈 화면 구축: 효율적인 네비게이션 구조를 설계하고 실시간 상품 노출을 위한 최적의 카드형 UI를 구현했습니다.

3. ⚡ 성능 및 최적화 전략
Zustand 전역 상태 관리: 파편화된 마이크로서비스의 상태를 효율적으로 통합 관리하여 불필요한 리렌더링과 API 호출을 방지합니다.

gRPC 최적화: Protocol Buffers를 활용해 통신 페이로드를 줄이고, 모바일 환경에서의 데이터 로딩 속도를 개선하는 트러블슈팅을 진행 중입니다.

🗣️ 스터디 및 지식 공유
주제: React Native + TypeScript를 활용한 홈 화면 구성 (with Expo Router)

내용: Expo Router를 활용한 선언적 라우팅 시스템 구축 및 타입 안정성을 확보한 컴포넌트 설계 가이드 작성

스터디 문서 바로가기 🔗

🏗️ Client-Server Infrastructure
<img width="1229" height="718" alt="Client Architecture" src="https://github.com/user-attachments/assets/dbf2b96e-d6cc-4010-916a-7a40c5e4e4bd" />

API Gateway: 모든 클라이언트 요청은 API Gateway를 통해 각 마이크로서비스로 라우팅됩니다.

S3 & CloudFront: 이미지 등 정적 리소스는 CDN을 통해 글로벌 엣지에서 빠르게 서빙되어 앱 UX를 향상시킵니다.

🛠️ Trouble Shooting (Client Perspective)
gRPC Metadata 누락 대응: API Gateway를 거쳐 서비스 호출 시 JWT 인증 메타데이터가 누락되는 문제를 발견하고, 클라이언트 통신 코드 보완을 통해 인증 프로세스를 정상화했습니다.
