/**
 * Shared TypeScript types for chatbot components
 * These types are extracted to improve maintainability and type reusability
 */

/**
 * Tool output type for service recommendations
 */
export interface ServiceRecommendation {
  serviceId: string
  planName?: string // Optional recommended plan name
}

export interface RecommendServiceOutput {
  services: ServiceRecommendation[]
  reasoning: string
}

/**
 * Base interface for all message parts
 */
interface BaseMessagePart {
  type: string
  text?: string
}

/**
 * Text message part
 */
interface TextMessagePart extends BaseMessagePart {
  type: 'text'
  text: string
}

/**
 * Tool message part with generic output type
 */
interface ToolMessagePart<T = unknown> extends BaseMessagePart {
  type: `tool-${string}`
  state?: 'output-available' | 'pending' | 'error'
  output?: T
}

/**
 * Specific tool message part for service recommendations
 */
interface RecommendServicePart extends BaseMessagePart {
  type: 'tool-recommendServices'
  state?: 'output-available' | 'pending' | 'error'
  output?: RecommendServiceOutput
}

/**
 * Union type for all possible message parts
 */
export type MessagePart = TextMessagePart | RecommendServicePart | ToolMessagePart

export interface ChatMessageType {
  id: string
  role: 'user' | 'assistant'
  content: string
  parts?: MessagePart[]
}

export type ChatRole = 'user' | 'assistant'
