# 📱 PIKIE : MSA 기반 유아용품 중고거래 서비스 (Client)

> **과학기술정보통신부 ICT 멘토링(한이음) 산학 협력 프로젝트**
> **React Native를 활용한 크로스 플랫폼 앱 개발 및 MSA 통신 최적화**

## 📌 프로젝트 개요
MSA(Microservice Architecture) 환경에서 최적화된 사용자 경험을 제공하기 위해 설계된 유아용품 특화 중고거래 플랫폼입니다. 
백엔드의 gRPC 기반 고성능 통신 구조를 이해하고, 클라이언트 단에서 **Zustand**와 **아토믹 디자인 패턴**을 활용해 확장성 있는 모바일 인터페이스를 구축하는 데 집중하고 있습니다.

## ⚙️ Tech Stack (Frontend)
- **Framework:** React Native (Expo Router 기반의 선언적 라우팅)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Styled-Components
- **Communication:** gRPC + Protocol Buffers

## 🧩 클라이언트 설계 핵심 역량

### 1. 🏗️ 디자인 시스템 및 컴포넌트 구조화
- **Atomic Design Pattern**: UI 요소를 원자(Atom) 단위로 모듈화하여 30개 이상의 공통 컴포넌트를 구축, 개발 생산성과 UI 일관성을 극대화했습니다.
- **컴포넌트 기반 아키텍처**: 재사용 가능한 비즈니스 로직과 UI 레이어를 분리하여 확장성 있는 코드 구조를 설계했습니다.

### 2. 🔌 MSA 환경의 통신 및 상태 관리
- **gRPC 데이터 연동**: 다수의 마이크로서비스로부터 오는 데이터를 gRPC 인터페이스를 통해 효율적으로 수신하고 처리합니다.
- **비동기 흐름 최적화**: Zustand를 활용하여 파편화된 서비스 간의 상태를 통합 관리하고, 불필요한 API 요청을 줄여 데이터 정합성을 확보했습니다.

### 3. 🗣️ 지식 공유 및 리딩 (선지오 담당 세션)
- **React Native 환경 구성**: 팀 내 Expo 및 TypeScript 초기 환경 셋업을 주도했습니다.
- **홈 화면 아키텍처 설계**: Expo Router를 활용한 화면 전환 로직 및 카드형 UI 인터페이스 설계를 담당하여 스터디 세션을 진행했습니다.
  - **[담당 스터디 문서 🔗](https://www.notion.so/2-21bafe091f23801ca0fbdb73f931d75b)**

## 🏗️ Architecture (System Understanding)
사용자 요청은 **API Gateway**를 통해 각 백엔드 서비스(ECS)로 전달되며, 모든 정적 리소스는 **S3와 CloudFront**를 통해 최적화된 속도로 클라이언트에 제공됩니다. 클라이언트는 이 복잡한 백엔드 구조 사이에서 데이터 일관성을 유지하며 매끄러운 UX를 구현합니다.

## 🛠️ Trouble Shooting

| 문제 상황 | 원인 및 분석 | 해결 방법 |
| :--- | :--- | :--- |
| **gRPC 호출 시 인증 누락** | Gateway 통신 과정에서 JWT 메타데이터가 정상 전달되지 않아 NullPointerException 발생 | 클라이언트 요청 헤더에 `Metadata` 전달 로직을 보완하여 인증 프로세스 정상화 |
| **비동기 데이터 렌더링 부하** | 마이크로서비스별 다량의 데이터 요청 시 UI 응답성 저하 발생 | Zustand 캐싱 전략 및 데이터 필터링 로직 최적화로 렌더링 성능 개선 |

---
© 2025 PIKIE Team - Front-end
