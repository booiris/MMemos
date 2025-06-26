/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @default "VISIBILITY_UNSPECIFIED" */
export enum V1Visibility {
  VISIBILITY_UNSPECIFIED = "VISIBILITY_UNSPECIFIED",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
  PUBLIC = "PUBLIC",
}

/** @default "STATE_UNSPECIFIED" */
export enum V1State {
  STATE_UNSPECIFIED = "STATE_UNSPECIFIED",
  NORMAL = "NORMAL",
  ARCHIVED = "ARCHIVED",
}

/**
 *  - LINE_BREAK: Block nodes.
 *  - TEXT: Inline nodes.
 * @default "NODE_UNSPECIFIED"
 */
export enum V1NodeType {
  NODE_UNSPECIFIED = "NODE_UNSPECIFIED",
  LINE_BREAK = "LINE_BREAK",
  PARAGRAPH = "PARAGRAPH",
  CODE_BLOCK = "CODE_BLOCK",
  HEADING = "HEADING",
  HORIZONTAL_RULE = "HORIZONTAL_RULE",
  BLOCKQUOTE = "BLOCKQUOTE",
  LIST = "LIST",
  ORDERED_LIST_ITEM = "ORDERED_LIST_ITEM",
  UNORDERED_LIST_ITEM = "UNORDERED_LIST_ITEM",
  TASK_LIST_ITEM = "TASK_LIST_ITEM",
  MATH_BLOCK = "MATH_BLOCK",
  TABLE = "TABLE",
  EMBEDDED_CONTENT = "EMBEDDED_CONTENT",
  TEXT = "TEXT",
  BOLD = "BOLD",
  ITALIC = "ITALIC",
  BOLD_ITALIC = "BOLD_ITALIC",
  CODE = "CODE",
  IMAGE = "IMAGE",
  LINK = "LINK",
  AUTO_LINK = "AUTO_LINK",
  TAG = "TAG",
  STRIKETHROUGH = "STRIKETHROUGH",
  ESCAPING_CHARACTER = "ESCAPING_CHARACTER",
  MATH = "MATH",
  HIGHLIGHT = "HIGHLIGHT",
  SUBSCRIPT = "SUBSCRIPT",
  SUPERSCRIPT = "SUPERSCRIPT",
  REFERENCED_CONTENT = "REFERENCED_CONTENT",
  SPOILER = "SPOILER",
  HTML_ELEMENT = "HTML_ELEMENT",
}

/** @default "TYPE_UNSPECIFIED" */
export enum V1MemoRelationType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  REFERENCE = "REFERENCE",
  COMMENT = "COMMENT",
}

/** @default "TYPE_UNSPECIFIED" */
export enum V1InboxType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  MEMO_COMMENT = "MEMO_COMMENT",
  VERSION_UPDATE = "VERSION_UPDATE",
}

/** @default "STATUS_UNSPECIFIED" */
export enum V1InboxStatus {
  STATUS_UNSPECIFIED = "STATUS_UNSPECIFIED",
  UNREAD = "UNREAD",
  ARCHIVED = "ARCHIVED",
}

/** @default "DIRECTION_UNSPECIFIED" */
export enum V1Direction {
  DIRECTION_UNSPECIFIED = "DIRECTION_UNSPECIFIED",
  ASC = "ASC",
  DESC = "DESC",
}

/**
 *  - DATABASE: DATABASE is the database storage type.
 *  - LOCAL: LOCAL is the local storage type.
 *  - S3: S3 is the S3 storage type.
 * @default "STORAGE_TYPE_UNSPECIFIED"
 */
export enum Apiv1WorkspaceStorageSettingStorageType {
  STORAGE_TYPE_UNSPECIFIED = "STORAGE_TYPE_UNSPECIFIED",
  DATABASE = "DATABASE",
  LOCAL = "LOCAL",
  S3 = "S3",
}

/** @default "TYPE_UNSPECIFIED" */
export enum Apiv1IdentityProviderType {
  TYPE_UNSPECIFIED = "TYPE_UNSPECIFIED",
  OAUTH2 = "OAUTH2",
}

/**
 * User role enumeration.
 *
 *  - ROLE_UNSPECIFIED: Unspecified role.
 *  - HOST: Host role with full system access.
 *  - ADMIN: Admin role with administrative privileges.
 *  - USER: Regular user role.
 * @default "ROLE_UNSPECIFIED"
 */
export enum UserRole {
  ROLE_UNSPECIFIED = "ROLE_UNSPECIFIED",
  HOST = "HOST",
  ADMIN = "ADMIN",
  USER = "USER",
}

/** @default "KIND_UNSPECIFIED" */
export enum ListNodeKind {
  KIND_UNSPECIFIED = "KIND_UNSPECIFIED",
  ORDERED = "ORDERED",
  UNORDERED = "UNORDERED",
  DESCRIPTION = "DESCRIPTION",
}

export interface MemoServiceRenameMemoTagBody {
  oldTag?: string;
  newTag?: string;
}

export interface MemoServiceSetMemoRelationsBody {
  relations?: V1MemoRelation[];
}

export interface MemoServiceSetMemoResourcesBody {
  resources?: V1Resource[];
}

export interface MemoServiceUpsertMemoReactionBody {
  reaction?: V1Reaction;
}

export interface TableNodeRow {
  cells?: V1Node[];
}

/** Memo type statistics. */
export interface UserStatsMemoTypeStats {
  /** @format int32 */
  linkCount?: number;
  /** @format int32 */
  codeCount?: number;
  /** @format int32 */
  todoCount?: number;
  /** @format int32 */
  undoCount?: number;
}

/** Reference: https://developers.cloudflare.com/r2/examples/aws/aws-sdk-go/ */
export interface WorkspaceStorageSettingS3Config {
  accessKeyId?: string;
  accessKeySecret?: string;
  endpoint?: string;
  region?: string;
  bucket?: string;
  usePathStyle?: boolean;
}

/**
 * Message that represents an arbitrary HTTP body. It should only be used for
 * payload formats that can't be represented as JSON, such as raw binary or
 * an HTML page.
 *
 *
 * This message can be used both in streaming and non-streaming API methods in
 * the request as well as the response.
 *
 * It can be used as a top-level request field, which is convenient if one
 * wants to extract parameters from either the URL or HTTP template into the
 * request fields and also want access to the raw HTTP body.
 *
 * Example:
 *
 *     message GetResourceRequest {
 *       // A unique request id.
 *       string request_id = 1;
 *
 *       // The raw HTTP body is bound to this field.
 *       google.api.HttpBody http_body = 2;
 *
 *     }
 *
 *     service ResourceService {
 *       rpc GetResource(GetResourceRequest)
 *         returns (google.api.HttpBody);
 *       rpc UpdateResource(google.api.HttpBody)
 *         returns (google.protobuf.Empty);
 *
 *     }
 *
 * Example with streaming methods:
 *
 *     service CaldavService {
 *       rpc GetCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *       rpc UpdateCalendar(stream google.api.HttpBody)
 *         returns (stream google.api.HttpBody);
 *
 *     }
 *
 * Use of this type only changes how the request and response bodies are
 * handled, all other features will continue to work unchanged.
 */
export interface ApiHttpBody {
  /** The HTTP Content-Type header value specifying the content type of the body. */
  contentType?: string;
  /**
   * The HTTP request/response body as raw binary.
   * @format byte
   */
  data?: string;
  /**
   * Application specific response metadata. Must be set in the first response
   * for streaming APIs.
   */
  extensions?: ProtobufAny[];
}

/** ActivityMemoCommentPayload represents the payload of a memo comment activity. */
export interface Apiv1ActivityMemoCommentPayload {
  /**
   * The memo name of comment.
   * Refer to `Memo.name`.
   */
  memo?: string;
  /** The name of related memo. */
  relatedMemo?: string;
}

export interface Apiv1ActivityPayload {
  /** ActivityMemoCommentPayload represents the payload of a memo comment activity. */
  memoComment?: Apiv1ActivityMemoCommentPayload;
}

export interface Apiv1FieldMapping {
  identifier?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

export interface Apiv1IdentityProvider {
  /**
   * The name of the identityProvider.
   * Format: identityProviders/{id}, id is the system generated auto-incremented id.
   */
  name?: string;
  type?: Apiv1IdentityProviderType;
  title?: string;
  identifierFilter?: string;
  config?: Apiv1IdentityProviderConfig;
}

export interface Apiv1IdentityProviderConfig {
  oauth2Config?: Apiv1OAuth2Config;
}

export interface Apiv1Location {
  placeholder?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
}

export interface Apiv1Memo {
  /**
   * The name of the memo.
   * Format: memos/{memo}, memo is the user defined id or uuid.
   */
  readonly name?: string;
  state?: V1State;
  /**
   * The name of the creator.
   * Format: users/{user}
   */
  creator?: string;
  /** @format date-time */
  createTime?: string;
  /** @format date-time */
  updateTime?: string;
  /** @format date-time */
  displayTime?: string;
  content?: string;
  readonly nodes?: V1Node[];
  visibility?: V1Visibility;
  readonly tags?: string[];
  pinned?: boolean;
  resources?: V1Resource[];
  relations?: V1MemoRelation[];
  readonly reactions?: V1Reaction[];
  readonly property?: V1MemoProperty;
  /**
   * The name of the parent memo.
   * Format: memos/{id}
   */
  readonly parent?: string;
  /** The snippet of the memo content. Plain text only. */
  readonly snippet?: string;
  /** The location of the memo. */
  location?: Apiv1Location;
}

export interface Apiv1OAuth2Config {
  clientId?: string;
  clientSecret?: string;
  authUrl?: string;
  tokenUrl?: string;
  userInfoUrl?: string;
  scopes?: string[];
  fieldMapping?: Apiv1FieldMapping;
}

export interface Apiv1Shortcut {
  id?: string;
  title?: string;
  filter?: string;
}

/** User settings message */
export interface Apiv1UserSetting {
  /**
   * The resource name of the user whose setting this is.
   * Format: users/{user}
   */
  name?: string;
  /** The preferred locale of the user. */
  locale?: string;
  /** The preferred appearance of the user. */
  appearance?: string;
  /** The default visibility of the memo. */
  memoVisibility?: string;
}

export interface Apiv1WorkspaceCustomProfile {
  title?: string;
  description?: string;
  logoUrl?: string;
  locale?: string;
  appearance?: string;
}

export interface Apiv1WorkspaceGeneralSetting {
  /** disallow_user_registration disallows user registration. */
  disallowUserRegistration?: boolean;
  /** disallow_password_auth disallows password authentication. */
  disallowPasswordAuth?: boolean;
  /** additional_script is the additional script. */
  additionalScript?: string;
  /** additional_style is the additional style. */
  additionalStyle?: string;
  /** custom_profile is the custom profile. */
  customProfile?: Apiv1WorkspaceCustomProfile;
  /**
   * week_start_day_offset is the week start day offset from Sunday.
   * 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
   * Default is Sunday.
   * @format int32
   */
  weekStartDayOffset?: number;
  /** disallow_change_username disallows changing username. */
  disallowChangeUsername?: boolean;
  /** disallow_change_nickname disallows changing nickname. */
  disallowChangeNickname?: boolean;
}

export interface Apiv1WorkspaceMemoRelatedSetting {
  /** disallow_public_visibility disallows set memo as public visibility. */
  disallowPublicVisibility?: boolean;
  /** display_with_update_time orders and displays memo with update time. */
  displayWithUpdateTime?: boolean;
  /**
   * content_length_limit is the limit of content length. Unit is byte.
   * @format int32
   */
  contentLengthLimit?: number;
  /** enable_double_click_edit enables editing on double click. */
  enableDoubleClickEdit?: boolean;
  /** enable_link_preview enables links preview. */
  enableLinkPreview?: boolean;
  /** enable_comment enables comment. */
  enableComment?: boolean;
  /** reactions is the list of reactions. */
  reactions?: string[];
  /** disable_markdown_shortcuts disallow the registration of markdown shortcuts. */
  disableMarkdownShortcuts?: boolean;
  /** enable_blur_nsfw_content enables blurring of content marked as not safe for work (NSFW). */
  enableBlurNsfwContent?: boolean;
  /** nsfw_tags is the list of tags that mark content as NSFW for blurring. */
  nsfwTags?: string[];
}

export interface Apiv1WorkspaceSetting {
  /**
   * name is the name of the setting.
   * Format: settings/{setting}
   */
  name?: string;
  generalSetting?: Apiv1WorkspaceGeneralSetting;
  storageSetting?: Apiv1WorkspaceStorageSetting;
  memoRelatedSetting?: Apiv1WorkspaceMemoRelatedSetting;
}

export interface Apiv1WorkspaceStorageSetting {
  /** storage_type is the storage type. */
  storageType?: Apiv1WorkspaceStorageSettingStorageType;
  /**
   * The template of file path.
   * e.g. assets/{timestamp}_{filename}
   */
  filepathTemplate?: string;
  /**
   * The max upload size in megabytes.
   * @format int64
   */
  uploadSizeLimitMb?: string;
  /** The S3 config. */
  s3Config?: WorkspaceStorageSettingS3Config;
}

export interface GooglerpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

/**
 * `Any` contains an arbitrary serialized protocol buffer message along with a
 * URL that describes the type of the serialized message.
 *
 * Protobuf library provides support to pack/unpack Any values in the form
 * of utility functions or additional generated methods of the Any type.
 *
 * Example 1: Pack and unpack a message in C++.
 *
 *     Foo foo = ...;
 *     Any any;
 *     any.PackFrom(foo);
 *     ...
 *     if (any.UnpackTo(&foo)) {
 *       ...
 *     }
 *
 * Example 2: Pack and unpack a message in Java.
 *
 *     Foo foo = ...;
 *     Any any = Any.pack(foo);
 *     ...
 *     if (any.is(Foo.class)) {
 *       foo = any.unpack(Foo.class);
 *     }
 *     // or ...
 *     if (any.isSameTypeAs(Foo.getDefaultInstance())) {
 *       foo = any.unpack(Foo.getDefaultInstance());
 *     }
 *
 *  Example 3: Pack and unpack a message in Python.
 *
 *     foo = Foo(...)
 *     any = Any()
 *     any.Pack(foo)
 *     ...
 *     if any.Is(Foo.DESCRIPTOR):
 *       any.Unpack(foo)
 *       ...
 *
 *  Example 4: Pack and unpack a message in Go
 *
 *      foo := &pb.Foo{...}
 *      any, err := anypb.New(foo)
 *      if err != nil {
 *        ...
 *      }
 *      ...
 *      foo := &pb.Foo{}
 *      if err := any.UnmarshalTo(foo); err != nil {
 *        ...
 *      }
 *
 * The pack methods provided by protobuf library will by default use
 * 'type.googleapis.com/full.type.name' as the type URL and the unpack
 * methods only use the fully qualified type name after the last '/'
 * in the type URL, for example "foo.bar.com/x/y.z" will yield type
 * name "y.z".
 *
 * JSON
 * ====
 * The JSON representation of an `Any` value uses the regular
 * representation of the deserialized, embedded message, with an
 * additional field `@type` which contains the type URL. Example:
 *
 *     package google.profile;
 *     message Person {
 *       string first_name = 1;
 *       string last_name = 2;
 *     }
 *
 *     {
 *       "@type": "type.googleapis.com/google.profile.Person",
 *       "firstName": <string>,
 *       "lastName": <string>
 *     }
 *
 * If the embedded message type is well-known and has a custom JSON
 * representation, that representation will be embedded adding a field
 * `value` which holds the custom JSON in addition to the `@type`
 * field. Example (for message [google.protobuf.Duration][]):
 *
 *     {
 *       "@type": "type.googleapis.com/google.protobuf.Duration",
 *       "value": "1.212s"
 *     }
 */
export interface ProtobufAny {
  /**
   * A URL/resource name that uniquely identifies the type of the serialized
   * protocol buffer message. This string must contain at least
   * one "/" character. The last segment of the URL's path must represent
   * the fully qualified name of the type (as in
   * `path/google.protobuf.Duration`). The name should be in a canonical form
   * (e.g., leading "." is not accepted).
   *
   * In practice, teams usually precompile into the binary all types that they
   * expect it to use in the context of Any. However, for URLs which use the
   * scheme `http`, `https`, or no scheme, one can optionally set up a type
   * server that maps type URLs to message definitions as follows:
   *
   * * If no scheme is provided, `https` is assumed.
   * * An HTTP GET on the URL must yield a [google.protobuf.Type][]
   *   value in binary format, or produce an error.
   * * Applications are allowed to cache lookup results based on the
   *   URL, or have them precompiled into a binary to avoid any
   *   lookup. Therefore, binary compatibility needs to be preserved
   *   on changes to types. (Use versioned type names to manage
   *   breaking changes.)
   *
   * Note: this functionality is not currently available in the official
   * protobuf release, and it is not used for type URLs beginning with
   * type.googleapis.com. As of May 2023, there are no widely used type server
   * implementations and no plans to implement one.
   *
   * Schemes other than `http`, `https` (or the empty scheme) might be
   * used with implementation specific semantics.
   */
  "@type"?: string;
  [key: string]: any;
}

export interface V1Activity {
  /**
   * The name of the activity.
   * Format: activities/{id}
   */
  readonly name?: string;
  /**
   * The name of the creator.
   * Format: users/{user}
   */
  creator?: string;
  /** The type of the activity. */
  type?: string;
  /** The level of the activity. */
  level?: string;
  /**
   * The create time of the activity.
   * @format date-time
   */
  readonly createTime?: string;
  /** The payload of the activity. */
  payload?: Apiv1ActivityPayload;
}

export interface V1AutoLinkNode {
  url?: string;
  isRawText?: boolean;
}

export interface V1BlockquoteNode {
  children?: V1Node[];
}

export interface V1BoldItalicNode {
  symbol?: string;
  content?: string;
}

export interface V1BoldNode {
  symbol?: string;
  children?: V1Node[];
}

export interface V1CodeBlockNode {
  language?: string;
  content?: string;
}

export interface V1CodeNode {
  content?: string;
}

export interface V1EmbeddedContentNode {
  resourceName?: string;
  params?: string;
}

export interface V1EscapingCharacterNode {
  symbol?: string;
}

export interface V1HTMLElementNode {
  tagName?: string;
  attributes?: Record<string, string>;
}

export interface V1HeadingNode {
  /** @format int32 */
  level?: number;
  children?: V1Node[];
}

export interface V1HighlightNode {
  content?: string;
}

export interface V1HorizontalRuleNode {
  symbol?: string;
}

export interface V1ImageNode {
  altText?: string;
  url?: string;
}

export interface V1Inbox {
  /**
   * The name of the inbox.
   * Format: inboxes/{id}, id is the system generated auto-incremented id.
   */
  name?: string;
  /** Format: users/{user} */
  sender?: string;
  /** Format: users/{user} */
  receiver?: string;
  status?: V1InboxStatus;
  /** @format date-time */
  createTime?: string;
  type?: V1InboxType;
  /** @format int32 */
  activityId?: number;
}

export interface V1ItalicNode {
  symbol?: string;
  children?: V1Node[];
}

export type V1LineBreakNode = object;

export interface V1LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
}

export interface V1LinkNode {
  content?: V1Node[];
  url?: string;
}

export interface V1ListAllUserStatsResponse {
  /** The list of user statistics. */
  userStats?: V1UserStats[];
  /** A token for the next page of results. */
  nextPageToken?: string;
  /**
   * The total count of user statistics.
   * @format int32
   */
  totalSize?: number;
}

export interface V1ListIdentityProvidersResponse {
  identityProviders?: Apiv1IdentityProvider[];
}

export interface V1ListInboxesResponse {
  inboxes?: V1Inbox[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken?: string;
}

export interface V1ListMemoCommentsResponse {
  memos?: Apiv1Memo[];
}

export interface V1ListMemoReactionsResponse {
  reactions?: V1Reaction[];
}

export interface V1ListMemoRelationsResponse {
  relations?: V1MemoRelation[];
}

export interface V1ListMemoResourcesResponse {
  resources?: V1Resource[];
}

export interface V1ListMemosResponse {
  memos?: Apiv1Memo[];
  /**
   * A token, which can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken?: string;
}

export interface V1ListNode {
  kind?: ListNodeKind;
  /** @format int32 */
  indent?: number;
  children?: V1Node[];
}

export interface V1ListResourcesResponse {
  resources?: V1Resource[];
}

export interface V1ListShortcutsResponse {
  shortcuts?: Apiv1Shortcut[];
}

export interface V1ListUserAccessTokensResponse {
  /** The list of access tokens. */
  accessTokens?: V1UserAccessToken[];
  /** A token for the next page of results. */
  nextPageToken?: string;
  /**
   * The total count of access tokens.
   * @format int32
   */
  totalSize?: number;
}

export interface V1ListUsersResponse {
  /** The list of users. */
  users?: V1User[];
  /**
   * A token that can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken?: string;
  /**
   * The total count of users (may be approximate).
   * @format int32
   */
  totalSize?: number;
}

export interface V1ListWebhooksResponse {
  /** The list of webhooks. */
  webhooks?: V1Webhook[];
  /**
   * A token that can be sent as `page_token` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  nextPageToken?: string;
  /**
   * The total count of webhooks (may be approximate).
   * @format int32
   */
  totalSize?: number;
}

export interface V1MathBlockNode {
  content?: string;
}

export interface V1MathNode {
  content?: string;
}

export interface V1MemoProperty {
  hasLink?: boolean;
  hasTaskList?: boolean;
  hasCode?: boolean;
  hasIncompleteTasks?: boolean;
}

export interface V1MemoRelation {
  memo?: V1MemoRelationMemo;
  relatedMemo?: V1MemoRelationMemo;
  type?: V1MemoRelationType;
}

export interface V1MemoRelationMemo {
  /**
   * The name of the memo.
   * Format: memos/{id}
   */
  name?: string;
  uid?: string;
  /** The snippet of the memo content. Plain text only. */
  readonly snippet?: string;
}

export interface V1Node {
  /**
   *  - LINE_BREAK: Block nodes.
   *  - TEXT: Inline nodes.
   */
  type?: V1NodeType;
  /** Block nodes. */
  lineBreakNode?: V1LineBreakNode;
  paragraphNode?: V1ParagraphNode;
  codeBlockNode?: V1CodeBlockNode;
  headingNode?: V1HeadingNode;
  horizontalRuleNode?: V1HorizontalRuleNode;
  blockquoteNode?: V1BlockquoteNode;
  listNode?: V1ListNode;
  orderedListItemNode?: V1OrderedListItemNode;
  unorderedListItemNode?: V1UnorderedListItemNode;
  taskListItemNode?: V1TaskListItemNode;
  mathBlockNode?: V1MathBlockNode;
  tableNode?: V1TableNode;
  embeddedContentNode?: V1EmbeddedContentNode;
  /** Inline nodes. */
  textNode?: V1TextNode;
  boldNode?: V1BoldNode;
  italicNode?: V1ItalicNode;
  boldItalicNode?: V1BoldItalicNode;
  codeNode?: V1CodeNode;
  imageNode?: V1ImageNode;
  linkNode?: V1LinkNode;
  autoLinkNode?: V1AutoLinkNode;
  tagNode?: V1TagNode;
  strikethroughNode?: V1StrikethroughNode;
  escapingCharacterNode?: V1EscapingCharacterNode;
  mathNode?: V1MathNode;
  highlightNode?: V1HighlightNode;
  subscriptNode?: V1SubscriptNode;
  superscriptNode?: V1SuperscriptNode;
  referencedContentNode?: V1ReferencedContentNode;
  spoilerNode?: V1SpoilerNode;
  htmlElementNode?: V1HTMLElementNode;
}

export interface V1OrderedListItemNode {
  number?: string;
  /** @format int32 */
  indent?: number;
  children?: V1Node[];
}

export interface V1ParagraphNode {
  children?: V1Node[];
}

export interface V1ParseMarkdownRequest {
  markdown?: string;
}

export interface V1ParseMarkdownResponse {
  nodes?: V1Node[];
}

export interface V1PasswordCredentials {
  /** The username to sign in with. */
  username?: string;
  /** The password to sign in with. */
  password?: string;
}

export interface V1Reaction {
  /** @format int32 */
  id?: number;
  /**
   * The name of the creator.
   * Format: users/{user}
   */
  creator?: string;
  /**
   * The content identifier.
   * For memo, it should be the `Memo.name`.
   */
  contentId?: string;
  reactionType?: string;
}

export interface V1ReferencedContentNode {
  resourceName?: string;
  params?: string;
}

export interface V1Resource {
  /**
   * The name of the resource.
   * Format: resources/{resource}, resource is the user defined if or uuid.
   */
  readonly name?: string;
  /** @format date-time */
  readonly createTime?: string;
  filename?: string;
  /** @format byte */
  content?: string;
  externalLink?: string;
  type?: string;
  /** @format int64 */
  size?: string;
  /** The related memo. Refer to `Memo.name`. */
  memo?: string;
}

export interface V1RestoreMarkdownNodesRequest {
  nodes?: V1Node[];
}

export interface V1RestoreMarkdownNodesResponse {
  markdown?: string;
}

export interface V1SSOCredentials {
  /**
   * The ID of the SSO provider.
   * @format int32
   */
  idpId?: number;
  /** The code to sign in with. */
  code?: string;
  /** The redirect URI. */
  redirectUri?: string;
}

export interface V1SearchUsersResponse {
  /** The list of users matching the search query. */
  users?: V1User[];
  /** A token for the next page of results. */
  nextPageToken?: string;
  /**
   * The total count of matching users.
   * @format int32
   */
  totalSize?: number;
}

export interface V1SpoilerNode {
  content?: string;
}

export interface V1StrikethroughNode {
  content?: string;
}

export interface V1StringifyMarkdownNodesRequest {
  nodes?: V1Node[];
}

export interface V1StringifyMarkdownNodesResponse {
  plainText?: string;
}

export interface V1SubscriptNode {
  content?: string;
}

export interface V1SuperscriptNode {
  content?: string;
}

export interface V1TableNode {
  header?: V1Node[];
  delimiter?: string[];
  rows?: TableNodeRow[];
}

export interface V1TagNode {
  content?: string;
}

export interface V1TaskListItemNode {
  symbol?: string;
  /** @format int32 */
  indent?: number;
  complete?: boolean;
  children?: V1Node[];
}

export interface V1TextNode {
  content?: string;
}

export interface V1UnorderedListItemNode {
  symbol?: string;
  /** @format int32 */
  indent?: number;
  children?: V1Node[];
}

export interface V1User {
  /**
   * The resource name of the user.
   * Format: users/{user}
   */
  name?: string;
  /** Output only. The system generated unique identifier. */
  readonly uid?: string;
  /** The role of the user. */
  role: UserRole;
  /** Required. The unique username for login. */
  username: string;
  /** Optional. The email address of the user. */
  email?: string;
  /** Optional. The display name of the user. */
  displayName?: string;
  /** Optional. The avatar URL of the user. */
  avatarUrl?: string;
  /** Optional. The description of the user. */
  description?: string;
  /** Input only. The password for the user. */
  password?: string;
  /** The state of the user. */
  state: V1State;
  /**
   * Output only. The creation timestamp.
   * @format date-time
   */
  readonly createTime?: string;
  /**
   * Output only. The last update timestamp.
   * @format date-time
   */
  readonly updateTime?: string;
  /** Output only. The etag for this resource. */
  readonly etag?: string;
}

/** User access token message */
export interface V1UserAccessToken {
  /**
   * The resource name of the access token.
   * Format: users/{user}/accessTokens/{access_token}
   */
  name?: string;
  /** Output only. The access token value. */
  readonly accessToken?: string;
  /** The description of the access token. */
  description?: string;
  /**
   * Output only. The issued timestamp.
   * @format date-time
   */
  readonly issuedAt?: string;
  /**
   * Optional. The expiration timestamp.
   * @format date-time
   */
  expiresAt?: string;
}

/** User statistics messages */
export interface V1UserStats {
  /**
   * The resource name of the user whose stats these are.
   * Format: users/{user}
   */
  name?: string;
  /** The timestamps when the memos were displayed. */
  memoDisplayTimestamps?: string[];
  /** The stats of memo types. */
  memoTypeStats?: UserStatsMemoTypeStats;
  /** The count of tags. */
  tagCount?: Record<string, number>;
  /** The pinned memos of the user. */
  pinnedMemos?: string[];
  /**
   * Total memo count.
   * @format int32
   */
  totalMemoCount?: number;
}

export interface V1Webhook {
  /**
   * The resource name of the webhook.
   * Format: webhooks/{webhook}
   */
  name?: string;
  /** Output only. The system generated unique identifier. */
  readonly uid?: string;
  /** Required. The display name of the webhook. */
  displayName: string;
  /** Required. The target URL for the webhook. */
  url: string;
  /**
   * Output only. The resource name of the creator.
   * Format: users/{user}
   */
  readonly creator?: string;
  /** The state of the webhook. */
  state: V1State;
  /**
   * Output only. The creation timestamp.
   * @format date-time
   */
  readonly createTime?: string;
  /**
   * Output only. The last update timestamp.
   * @format date-time
   */
  readonly updateTime?: string;
  /** Output only. The etag for this resource. */
  readonly etag?: string;
}

/** Workspace profile message containing basic workspace information. */
export interface V1WorkspaceProfile {
  /**
   * The name of instance owner.
   * Format: users/{user}
   */
  owner?: string;
  /** Version is the current version of instance. */
  version?: string;
  /** Mode is the instance mode (e.g. "prod", "dev" or "demo"). */
  mode?: string;
  /** Instance URL is the URL of the instance. */
  instanceUrl?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title api/v1/activity_service.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * No description
     *
     * @tags AuthService
     * @name AuthServiceSignIn
     * @summary SignIn signs in the user.
     * @request POST:/api/v1/auth/signin
     */
    authServiceSignIn: (
      query?: {
        /** The username to sign in with. */
        "passwordCredentials.username"?: string;
        /** The password to sign in with. */
        "passwordCredentials.password"?: string;
        /**
         * The ID of the SSO provider.
         * @format int32
         */
        "ssoCredentials.idpId"?: number;
        /** The code to sign in with. */
        "ssoCredentials.code"?: string;
        /** The redirect URI. */
        "ssoCredentials.redirectUri"?: string;
        /** Whether the session should never expire. */
        neverExpire?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/auth/signin`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AuthServiceSignOut
     * @summary SignOut signs out the user.
     * @request POST:/api/v1/auth/signout
     */
    authServiceSignOut: (params: RequestParams = {}) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/auth/signout`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AuthServiceSignUp
     * @summary SignUp signs up the user with the given username and password.
     * @request POST:/api/v1/auth/signup
     */
    authServiceSignUp: (
      query?: {
        /** The username to sign up with. */
        username?: string;
        /** The password to sign up with. */
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/auth/signup`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags AuthService
     * @name AuthServiceGetAuthStatus
     * @summary GetAuthStatus returns the current auth status of the user.
     * @request POST:/api/v1/auth/status
     */
    authServiceGetAuthStatus: (params: RequestParams = {}) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/auth/status`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProviderService
     * @name IdentityProviderServiceListIdentityProviders
     * @summary ListIdentityProviders lists identity providers.
     * @request GET:/api/v1/identityProviders
     */
    identityProviderServiceListIdentityProviders: (
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListIdentityProvidersResponse, GooglerpcStatus>({
        path: `/api/v1/identityProviders`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProviderService
     * @name IdentityProviderServiceCreateIdentityProvider
     * @summary CreateIdentityProvider creates an identity provider.
     * @request POST:/api/v1/identityProviders
     */
    identityProviderServiceCreateIdentityProvider: (
      identityProvider: Apiv1IdentityProvider,
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1IdentityProvider, GooglerpcStatus>({
        path: `/api/v1/identityProviders`,
        method: "POST",
        body: identityProvider,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags InboxService
     * @name InboxServiceListInboxes
     * @summary ListInboxes lists inboxes for a user.
     * @request GET:/api/v1/inboxes
     */
    inboxServiceListInboxes: (
      query?: {
        /** Format: users/{user} */
        user?: string;
        /**
         * The maximum number of inbox to return.
         * @format int32
         */
        pageSize?: number;
        /** Provide this to retrieve the subsequent page. */
        pageToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListInboxesResponse, GooglerpcStatus>({
        path: `/api/v1/inboxes`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MarkdownService
     * @name MarkdownServiceGetLinkMetadata
     * @summary GetLinkMetadata returns metadata for a given link.
     * @request GET:/api/v1/markdown/link:metadata
     */
    markdownServiceGetLinkMetadata: (
      metadata: string,
      query?: {
        link?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1LinkMetadata, GooglerpcStatus>({
        path: `/api/v1/markdown/link${metadata}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MarkdownService
     * @name MarkdownServiceRestoreMarkdownNodes
     * @summary RestoreMarkdownNodes restores the given nodes to markdown content.
     * @request POST:/api/v1/markdown/node:restore
     */
    markdownServiceRestoreMarkdownNodes: (
      restore: string,
      body: V1RestoreMarkdownNodesRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<V1RestoreMarkdownNodesResponse, GooglerpcStatus>({
        path: `/api/v1/markdown/node${restore}`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MarkdownService
     * @name MarkdownServiceStringifyMarkdownNodes
     * @summary StringifyMarkdownNodes stringify the given nodes to plain text content.
     * @request POST:/api/v1/markdown/node:stringify
     */
    markdownServiceStringifyMarkdownNodes: (
      stringify: string,
      body: V1StringifyMarkdownNodesRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<V1StringifyMarkdownNodesResponse, GooglerpcStatus>({
        path: `/api/v1/markdown/node${stringify}`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MarkdownService
     * @name MarkdownServiceParseMarkdown
     * @summary ParseMarkdown parses the given markdown content and returns a list of nodes.
     * @request POST:/api/v1/markdown:parse
     */
    markdownServiceParseMarkdown: (
      parse: string,
      body: V1ParseMarkdownRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<V1ParseMarkdownResponse, GooglerpcStatus>({
        path: `/api/v1/markdown${parse}`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemos
     * @summary ListMemos lists memos with pagination and filter.
     * @request GET:/api/v1/memos
     */
    memoServiceListMemos: (
      query?: {
        /**
         * The parent is the owner of the memos.
         * If not specified or `users/-`, it will list all memos.
         */
        parent?: string;
        /**
         * The maximum number of memos to return.
         * @format int32
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListMemos` call.
         * Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * The state of the memos to list.
         * Default to `NORMAL`. Set to `ARCHIVED` to list archived memos.
         * @default "STATE_UNSPECIFIED"
         */
        state?: "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";
        /**
         * What field to sort the results by.
         * Default to display_time.
         */
        sort?: string;
        /**
         * The direction to sort the results by.
         * Default to DESC.
         * @default "DIRECTION_UNSPECIFIED"
         */
        direction?: "DIRECTION_UNSPECIFIED" | "ASC" | "DESC";
        /**
         * Filter is a CEL expression to filter memos.
         * Refer to `Shortcut.filter`.
         */
        filter?: string;
        /**
         * [Deprecated] Old filter contains some specific conditions to filter memos.
         * Format: "creator == 'users/{user}' && visibilities == ['PUBLIC', 'PROTECTED']"
         */
        oldFilter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListMemosResponse, GooglerpcStatus>({
        path: `/api/v1/memos`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceCreateMemo
     * @summary CreateMemo creates a memo.
     * @request POST:/api/v1/memos
     */
    memoServiceCreateMemo: (memo: Apiv1Memo, params: RequestParams = {}) =>
      this.http.request<Apiv1Memo, GooglerpcStatus>({
        path: `/api/v1/memos`,
        method: "POST",
        body: memo,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceDeleteMemoReaction
     * @summary DeleteMemoReaction deletes a reaction for a memo.
     * @request DELETE:/api/v1/reactions/{id}
     */
    memoServiceDeleteMemoReaction: (id: number, params: RequestParams = {}) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/reactions/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceListResources
     * @summary ListResources lists all resources.
     * @request GET:/api/v1/resources
     */
    resourceServiceListResources: (params: RequestParams = {}) =>
      this.http.request<V1ListResourcesResponse, GooglerpcStatus>({
        path: `/api/v1/resources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceCreateResource
     * @summary CreateResource creates a new resource.
     * @request POST:/api/v1/resources
     */
    resourceServiceCreateResource: (
      resource: V1Resource,
      params: RequestParams = {},
    ) =>
      this.http.request<V1Resource, GooglerpcStatus>({
        path: `/api/v1/resources`,
        method: "POST",
        body: resource,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceListUsers
     * @summary ListUsers returns a list of users.
     * @request GET:/api/v1/users
     */
    userServiceListUsers: (
      query?: {
        /**
         * Optional. The maximum number of users to return.
         * The service may return fewer than this value.
         * If unspecified, at most 50 users will be returned.
         * The maximum value is 1000; values above 1000 will be coerced to 1000.
         * @format int32
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListUsers` call.
         * Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Optional. Filter to apply to the list results.
         * Example: "state=ACTIVE" or "role=USER" or "email:@example.com"
         * Supported operators: =, !=, <, <=, >, >=, :
         * Supported fields: username, email, role, state, create_time, update_time
         */
        filter?: string;
        /**
         * Optional. The order to sort results by.
         * Example: "create_time desc" or "username asc"
         */
        orderBy?: string;
        /** Optional. If true, show deleted users in the response. */
        showDeleted?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListUsersResponse, GooglerpcStatus>({
        path: `/api/v1/users`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceCreateUser
     * @summary CreateUser creates a new user.
     * @request POST:/api/v1/users
     */
    userServiceCreateUser: (
      user: V1User,
      query?: {
        /**
         * Optional. The user ID to use for this user.
         * If empty, a unique ID will be generated.
         * Must match the pattern [a-z0-9-]+
         */
        userId?: string;
        /** Optional. If set, validate the request but don't actually create the user. */
        validateOnly?: boolean;
        /**
         * Optional. An idempotency token that can be used to ensure that multiple
         * requests to create a user have the same result.
         */
        requestId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/users`,
        method: "POST",
        query: query,
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceSearchUsers
     * @summary SearchUsers searches for users based on query.
     * @request GET:/api/v1/users:search
     */
    userServiceSearchUsers: (
      search: string,
      query: {
        /** Required. The search query. */
        query: string;
        /**
         * Optional. The maximum number of users to return.
         * @format int32
         */
        pageSize?: number;
        /** Optional. A page token for pagination. */
        pageToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1SearchUsersResponse, GooglerpcStatus>({
        path: `/api/v1/users${search}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceListAllUserStats
     * @summary ListAllUserStats returns statistics for all users.
     * @request GET:/api/v1/users:stats
     */
    userServiceListAllUserStats: (
      stats: string,
      query?: {
        /**
         * Optional. The maximum number of user stats to return.
         * @format int32
         */
        pageSize?: number;
        /** Optional. A page token for pagination. */
        pageToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListAllUserStatsResponse, GooglerpcStatus>({
        path: `/api/v1/users${stats}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WebhookService
     * @name WebhookServiceListWebhooks
     * @summary ListWebhooks returns a list of webhooks.
     * @request GET:/api/v1/webhooks
     */
    webhookServiceListWebhooks: (
      query?: {
        /**
         * Optional. The maximum number of webhooks to return.
         * The service may return fewer than this value.
         * If unspecified, at most 50 webhooks will be returned.
         * The maximum value is 1000; values above 1000 will be coerced to 1000.
         * @format int32
         */
        pageSize?: number;
        /**
         * Optional. A page token, received from a previous `ListWebhooks` call.
         * Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * Optional. Filter to apply to the list results.
         * Example: "state=ACTIVE" or "creator=users/123"
         * Supported operators: =, !=, <, <=, >, >=, :
         * Supported fields: display_name, url, creator, state, create_time, update_time
         */
        filter?: string;
        /**
         * Optional. The order to sort results by.
         * Example: "create_time desc" or "display_name asc"
         */
        orderBy?: string;
        /** Optional. If true, show deleted webhooks in the response. */
        showDeleted?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListWebhooksResponse, GooglerpcStatus>({
        path: `/api/v1/webhooks`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WebhookService
     * @name WebhookServiceCreateWebhook
     * @summary CreateWebhook creates a new webhook.
     * @request POST:/api/v1/webhooks
     */
    webhookServiceCreateWebhook: (
      webhook: V1Webhook,
      query?: {
        /**
         * Optional. The webhook ID to use for this webhook.
         * If empty, a unique ID will be generated.
         * Must match the pattern [a-z0-9-]+
         */
        webhookId?: string;
        /** Optional. If set, validate the request but don't actually create the webhook. */
        validateOnly?: boolean;
        /**
         * Optional. An idempotency token that can be used to ensure that multiple
         * requests to create a webhook have the same result.
         */
        requestId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1Webhook, GooglerpcStatus>({
        path: `/api/v1/webhooks`,
        method: "POST",
        query: query,
        body: webhook,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WorkspaceService
     * @name WorkspaceServiceGetWorkspaceProfile
     * @summary Gets the workspace profile.
     * @request GET:/api/v1/workspace/profile
     */
    workspaceServiceGetWorkspaceProfile: (params: RequestParams = {}) =>
      this.http.request<V1WorkspaceProfile, GooglerpcStatus>({
        path: `/api/v1/workspace/profile`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WorkspaceSettingService
     * @name WorkspaceSettingServiceGetWorkspaceSetting
     * @summary GetWorkspaceSetting returns the setting by name.
     * @request GET:/api/v1/workspace/{name}
     */
    workspaceSettingServiceGetWorkspaceSetting: (
      name: string,
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1WorkspaceSetting, GooglerpcStatus>({
        path: `/api/v1/workspace/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WorkspaceSettingService
     * @name WorkspaceSettingServiceSetWorkspaceSetting
     * @summary SetWorkspaceSetting updates the setting.
     * @request PATCH:/api/v1/workspace/{setting.name}
     */
    workspaceSettingServiceSetWorkspaceSetting: (
      settingName: string,
      setting: {
        generalSetting?: Apiv1WorkspaceGeneralSetting;
        storageSetting?: Apiv1WorkspaceStorageSetting;
        memoRelatedSetting?: Apiv1WorkspaceMemoRelatedSetting;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1WorkspaceSetting, GooglerpcStatus>({
        path: `/api/v1/workspace/${settingName}`,
        method: "PATCH",
        body: setting,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProviderService
     * @name IdentityProviderServiceUpdateIdentityProvider
     * @summary UpdateIdentityProvider updates an identity provider.
     * @request PATCH:/api/v1/{identityProvider.name}
     */
    identityProviderServiceUpdateIdentityProvider: (
      identityProviderName: string,
      identityProvider: {
        type?: Apiv1IdentityProviderType;
        title?: string;
        identifierFilter?: string;
        config?: Apiv1IdentityProviderConfig;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1IdentityProvider, GooglerpcStatus>({
        path: `/api/v1/${identityProviderName}`,
        method: "PATCH",
        body: identityProvider,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags InboxService
     * @name InboxServiceUpdateInbox
     * @summary UpdateInbox updates an inbox.
     * @request PATCH:/api/v1/{inbox.name}
     */
    inboxServiceUpdateInbox: (
      inboxName: string,
      inbox: {
        /** Format: users/{user} */
        sender?: string;
        /** Format: users/{user} */
        receiver?: string;
        status?: V1InboxStatus;
        /** @format date-time */
        createTime?: string;
        type?: V1InboxType;
        /** @format int32 */
        activityId?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1Inbox, GooglerpcStatus>({
        path: `/api/v1/${inboxName}`,
        method: "PATCH",
        body: inbox,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceUpdateMemo
     * @summary UpdateMemo updates a memo.
     * @request PATCH:/api/v1/{memo.name}
     */
    memoServiceUpdateMemo: (
      memoName: string,
      memo: {
        state?: V1State;
        /**
         * The name of the creator.
         * Format: users/{user}
         */
        creator?: string;
        /** @format date-time */
        createTime?: string;
        /** @format date-time */
        updateTime?: string;
        /** @format date-time */
        displayTime?: string;
        content?: string;
        readonly nodes?: V1Node[];
        visibility?: V1Visibility;
        readonly tags?: string[];
        pinned?: boolean;
        resources?: V1Resource[];
        relations?: V1MemoRelation[];
        readonly reactions?: V1Reaction[];
        readonly property?: V1MemoProperty;
        /**
         * The name of the parent memo.
         * Format: memos/{id}
         */
        readonly parent?: string;
        /** The snippet of the memo content. Plain text only. */
        readonly snippet?: string;
        /** The location of the memo. */
        location?: Apiv1Location;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1Memo, GooglerpcStatus>({
        path: `/api/v1/${memoName}`,
        method: "PATCH",
        body: memo,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceGetUser
     * @summary GetUser gets a user by name.
     * @request GET:/api/v1/{name_1}
     */
    userServiceGetUser: (
      name1: string,
      query?: {
        /**
         * Optional. The fields to return in the response.
         * If not specified, all fields are returned.
         */
        readMask?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/${name1}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceDeleteUserAccessToken
     * @summary DeleteUserAccessToken deletes an access token.
     * @request DELETE:/api/v1/{name_1}
     */
    userServiceDeleteUserAccessToken: (
      name1: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name1}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProviderService
     * @name IdentityProviderServiceGetIdentityProvider
     * @summary GetIdentityProvider gets an identity provider.
     * @request GET:/api/v1/{name_2}
     */
    identityProviderServiceGetIdentityProvider: (
      name2: string,
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1IdentityProvider, GooglerpcStatus>({
        path: `/api/v1/${name2}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags IdentityProviderService
     * @name IdentityProviderServiceDeleteIdentityProvider
     * @summary DeleteIdentityProvider deletes an identity provider.
     * @request DELETE:/api/v1/{name_2}
     */
    identityProviderServiceDeleteIdentityProvider: (
      name2: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name2}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceGetResource
     * @summary GetResource returns a resource by name.
     * @request GET:/api/v1/{name_3}
     */
    resourceServiceGetResource: (name3: string, params: RequestParams = {}) =>
      this.http.request<V1Resource, GooglerpcStatus>({
        path: `/api/v1/${name3}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags InboxService
     * @name InboxServiceDeleteInbox
     * @summary DeleteInbox deletes an inbox.
     * @request DELETE:/api/v1/{name_3}
     */
    inboxServiceDeleteInbox: (name3: string, params: RequestParams = {}) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name3}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceGetMemo
     * @summary GetMemo gets a memo.
     * @request GET:/api/v1/{name_4}
     */
    memoServiceGetMemo: (name4: string, params: RequestParams = {}) =>
      this.http.request<Apiv1Memo, GooglerpcStatus>({
        path: `/api/v1/${name4}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceDeleteResource
     * @summary DeleteResource deletes a resource by name.
     * @request DELETE:/api/v1/{name_4}
     */
    resourceServiceDeleteResource: (
      name4: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name4}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WebhookService
     * @name WebhookServiceGetWebhook
     * @summary GetWebhook gets a webhook by name.
     * @request GET:/api/v1/{name_5}
     */
    webhookServiceGetWebhook: (
      name5: string,
      query?: {
        /**
         * Optional. The fields to return in the response.
         * If not specified, all fields are returned.
         */
        readMask?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1Webhook, GooglerpcStatus>({
        path: `/api/v1/${name5}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceDeleteMemo
     * @summary DeleteMemo deletes a memo.
     * @request DELETE:/api/v1/{name_5}
     */
    memoServiceDeleteMemo: (name5: string, params: RequestParams = {}) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name5}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WebhookService
     * @name WebhookServiceDeleteWebhook
     * @summary DeleteWebhook deletes a webhook.
     * @request DELETE:/api/v1/{name_6}
     */
    webhookServiceDeleteWebhook: (
      name6: string,
      query?: {
        /** Optional. If set to true, the webhook will be deleted even if it has associated data. */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name6}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ActivityService
     * @name ActivityServiceGetActivity
     * @summary GetActivity returns the activity with the given id.
     * @request GET:/api/v1/{name}
     */
    activityServiceGetActivity: (name: string, params: RequestParams = {}) =>
      this.http.request<V1Activity, GooglerpcStatus>({
        path: `/api/v1/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceDeleteUser
     * @summary DeleteUser deletes a user.
     * @request DELETE:/api/v1/{name}
     */
    userServiceDeleteUser: (
      name: string,
      query?: {
        /** Optional. If set to true, the user will be deleted even if they have associated data. */
        force?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceGetUserAvatar
     * @summary GetUserAvatar gets the avatar of a user.
     * @request GET:/api/v1/{name}/avatar
     */
    userServiceGetUserAvatar: (name: string, params: RequestParams = {}) =>
      this.http.request<ApiHttpBody, GooglerpcStatus>({
        path: `/api/v1/${name}/avatar`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemoComments
     * @summary ListMemoComments lists comments for a memo.
     * @request GET:/api/v1/{name}/comments
     */
    memoServiceListMemoComments: (name: string, params: RequestParams = {}) =>
      this.http.request<V1ListMemoCommentsResponse, GooglerpcStatus>({
        path: `/api/v1/${name}/comments`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceCreateMemoComment
     * @summary CreateMemoComment creates a comment for a memo.
     * @request POST:/api/v1/{name}/comments
     */
    memoServiceCreateMemoComment: (
      name: string,
      comment: Apiv1Memo,
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1Memo, GooglerpcStatus>({
        path: `/api/v1/${name}/comments`,
        method: "POST",
        body: comment,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemoReactions
     * @summary ListMemoReactions lists reactions for a memo.
     * @request GET:/api/v1/{name}/reactions
     */
    memoServiceListMemoReactions: (name: string, params: RequestParams = {}) =>
      this.http.request<V1ListMemoReactionsResponse, GooglerpcStatus>({
        path: `/api/v1/${name}/reactions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceUpsertMemoReaction
     * @summary UpsertMemoReaction upserts a reaction for a memo.
     * @request POST:/api/v1/{name}/reactions
     */
    memoServiceUpsertMemoReaction: (
      name: string,
      body: MemoServiceUpsertMemoReactionBody,
      params: RequestParams = {},
    ) =>
      this.http.request<V1Reaction, GooglerpcStatus>({
        path: `/api/v1/${name}/reactions`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemoRelations
     * @summary ListMemoRelations lists relations for a memo.
     * @request GET:/api/v1/{name}/relations
     */
    memoServiceListMemoRelations: (name: string, params: RequestParams = {}) =>
      this.http.request<V1ListMemoRelationsResponse, GooglerpcStatus>({
        path: `/api/v1/${name}/relations`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceSetMemoRelations
     * @summary SetMemoRelations sets relations for a memo.
     * @request PATCH:/api/v1/{name}/relations
     */
    memoServiceSetMemoRelations: (
      name: string,
      body: MemoServiceSetMemoRelationsBody,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name}/relations`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemoResources
     * @summary ListMemoResources lists resources for a memo.
     * @request GET:/api/v1/{name}/resources
     */
    memoServiceListMemoResources: (name: string, params: RequestParams = {}) =>
      this.http.request<V1ListMemoResourcesResponse, GooglerpcStatus>({
        path: `/api/v1/${name}/resources`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceSetMemoResources
     * @summary SetMemoResources sets resources for a memo.
     * @request PATCH:/api/v1/{name}/resources
     */
    memoServiceSetMemoResources: (
      name: string,
      body: MemoServiceSetMemoResourcesBody,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${name}/resources`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceGetUserSetting
     * @summary GetUserSetting returns the user setting.
     * @request GET:/api/v1/{name}:getSetting
     */
    userServiceGetUserSetting: (
      name: string,
      getSetting: string,
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1UserSetting, GooglerpcStatus>({
        path: `/api/v1/${name}${getSetting}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceGetUserStats
     * @summary GetUserStats returns statistics for a specific user.
     * @request GET:/api/v1/{name}:getStats
     */
    userServiceGetUserStats: (
      name: string,
      getStats: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1UserStats, GooglerpcStatus>({
        path: `/api/v1/${name}${getStats}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceListUserAccessTokens
     * @summary ListUserAccessTokens returns a list of access tokens for a user.
     * @request GET:/api/v1/{parent}/accessTokens
     */
    userServiceListUserAccessTokens: (
      parent: string,
      query?: {
        /**
         * Optional. The maximum number of access tokens to return.
         * @format int32
         */
        pageSize?: number;
        /** Optional. A page token for pagination. */
        pageToken?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListUserAccessTokensResponse, GooglerpcStatus>({
        path: `/api/v1/${parent}/accessTokens`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceCreateUserAccessToken
     * @summary CreateUserAccessToken creates a new access token for a user.
     * @request POST:/api/v1/{parent}/accessTokens
     */
    userServiceCreateUserAccessToken: (
      parent: string,
      accessToken: V1UserAccessToken,
      query?: {
        /** Optional. The access token ID to use. */
        accessTokenId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1UserAccessToken, GooglerpcStatus>({
        path: `/api/v1/${parent}/accessTokens`,
        method: "POST",
        query: query,
        body: accessToken,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceListMemos2
     * @summary ListMemos lists memos with pagination and filter.
     * @request GET:/api/v1/{parent}/memos
     */
    memoServiceListMemos2: (
      parent: string,
      query?: {
        /**
         * The maximum number of memos to return.
         * @format int32
         */
        pageSize?: number;
        /**
         * A page token, received from a previous `ListMemos` call.
         * Provide this to retrieve the subsequent page.
         */
        pageToken?: string;
        /**
         * The state of the memos to list.
         * Default to `NORMAL`. Set to `ARCHIVED` to list archived memos.
         * @default "STATE_UNSPECIFIED"
         */
        state?: "STATE_UNSPECIFIED" | "NORMAL" | "ARCHIVED";
        /**
         * What field to sort the results by.
         * Default to display_time.
         */
        sort?: string;
        /**
         * The direction to sort the results by.
         * Default to DESC.
         * @default "DIRECTION_UNSPECIFIED"
         */
        direction?: "DIRECTION_UNSPECIFIED" | "ASC" | "DESC";
        /**
         * Filter is a CEL expression to filter memos.
         * Refer to `Shortcut.filter`.
         */
        filter?: string;
        /**
         * [Deprecated] Old filter contains some specific conditions to filter memos.
         * Format: "creator == 'users/{user}' && visibilities == ['PUBLIC', 'PROTECTED']"
         */
        oldFilter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListMemosResponse, GooglerpcStatus>({
        path: `/api/v1/${parent}/memos`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ShortcutService
     * @name ShortcutServiceListShortcuts
     * @summary ListShortcuts returns a list of shortcuts for a user.
     * @request GET:/api/v1/{parent}/shortcuts
     */
    shortcutServiceListShortcuts: (
      parent: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1ListShortcutsResponse, GooglerpcStatus>({
        path: `/api/v1/${parent}/shortcuts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ShortcutService
     * @name ShortcutServiceCreateShortcut
     * @summary CreateShortcut creates a new shortcut for a user.
     * @request POST:/api/v1/{parent}/shortcuts
     */
    shortcutServiceCreateShortcut: (
      parent: string,
      shortcut: Apiv1Shortcut,
      query?: {
        validateOnly?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1Shortcut, GooglerpcStatus>({
        path: `/api/v1/${parent}/shortcuts`,
        method: "POST",
        query: query,
        body: shortcut,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ShortcutService
     * @name ShortcutServiceDeleteShortcut
     * @summary DeleteShortcut deletes a shortcut for a user.
     * @request DELETE:/api/v1/{parent}/shortcuts/{id}
     */
    shortcutServiceDeleteShortcut: (
      parent: string,
      id: string,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${parent}/shortcuts/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ShortcutService
     * @name ShortcutServiceUpdateShortcut
     * @summary UpdateShortcut updates a shortcut for a user.
     * @request PATCH:/api/v1/{parent}/shortcuts/{shortcut.id}
     */
    shortcutServiceUpdateShortcut: (
      parent: string,
      shortcutId: string,
      shortcut: {
        title?: string;
        filter?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1Shortcut, GooglerpcStatus>({
        path: `/api/v1/${parent}/shortcuts/${shortcutId}`,
        method: "PATCH",
        body: shortcut,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceDeleteMemoTag
     * @summary DeleteMemoTag deletes a tag for a memo.
     * @request DELETE:/api/v1/{parent}/tags/{tag}
     */
    memoServiceDeleteMemoTag: (
      parent: string,
      tag: string,
      query?: {
        deleteRelatedMemos?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${parent}/tags/${tag}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags MemoService
     * @name MemoServiceRenameMemoTag
     * @summary RenameMemoTag renames a tag for a memo.
     * @request PATCH:/api/v1/{parent}/tags:rename
     */
    memoServiceRenameMemoTag: (
      parent: string,
      rename: string,
      body: MemoServiceRenameMemoTagBody,
      params: RequestParams = {},
    ) =>
      this.http.request<V1LineBreakNode, GooglerpcStatus>({
        path: `/api/v1/${parent}/tags${rename}`,
        method: "PATCH",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceUpdateResource
     * @summary UpdateResource updates a resource.
     * @request PATCH:/api/v1/{resource.name}
     */
    resourceServiceUpdateResource: (
      resourceName: string,
      resource: {
        /** @format date-time */
        readonly createTime?: string;
        filename?: string;
        /** @format byte */
        content?: string;
        externalLink?: string;
        type?: string;
        /** @format int64 */
        size?: string;
        /** The related memo. Refer to `Memo.name`. */
        memo?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1Resource, GooglerpcStatus>({
        path: `/api/v1/${resourceName}`,
        method: "PATCH",
        body: resource,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceUpdateUserSetting
     * @summary UpdateUserSetting updates the user setting.
     * @request PATCH:/api/v1/{setting.name}:updateSetting
     */
    userServiceUpdateUserSetting: (
      settingName: string,
      updateSetting: string,
      setting: {
        /** The preferred locale of the user. */
        locale?: string;
        /** The preferred appearance of the user. */
        appearance?: string;
        /** The default visibility of the memo. */
        memoVisibility?: string;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<Apiv1UserSetting, GooglerpcStatus>({
        path: `/api/v1/${settingName}${updateSetting}`,
        method: "PATCH",
        body: setting,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags UserService
     * @name UserServiceUpdateUser
     * @summary UpdateUser updates a user.
     * @request PATCH:/api/v1/{user.name}
     */
    userServiceUpdateUser: (
      userName: string,
      user: {
        /** Output only. The system generated unique identifier. */
        readonly uid?: string;
        /** The role of the user. */
        role: UserRole;
        /** Required. The unique username for login. */
        username: string;
        /** Optional. The email address of the user. */
        email?: string;
        /** Optional. The display name of the user. */
        displayName?: string;
        /** Optional. The avatar URL of the user. */
        avatarUrl?: string;
        /** Optional. The description of the user. */
        description?: string;
        /** Input only. The password for the user. */
        password?: string;
        /** The state of the user. */
        state: V1State;
        /**
         * Output only. The creation timestamp.
         * @format date-time
         */
        readonly createTime?: string;
        /**
         * Output only. The last update timestamp.
         * @format date-time
         */
        readonly updateTime?: string;
        /** Output only. The etag for this resource. */
        readonly etag?: string;
      },
      query?: {
        /** Optional. If set to true, allows updating sensitive fields. */
        allowMissing?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1User, GooglerpcStatus>({
        path: `/api/v1/${userName}`,
        method: "PATCH",
        query: query,
        body: user,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags WebhookService
     * @name WebhookServiceUpdateWebhook
     * @summary UpdateWebhook updates a webhook.
     * @request PATCH:/api/v1/{webhook.name}
     */
    webhookServiceUpdateWebhook: (
      webhookName: string,
      webhook: {
        /** Output only. The system generated unique identifier. */
        readonly uid?: string;
        /** Required. The display name of the webhook. */
        displayName: string;
        /** Required. The target URL for the webhook. */
        url: string;
        /**
         * Output only. The resource name of the creator.
         * Format: users/{user}
         */
        readonly creator?: string;
        /** The state of the webhook. */
        state: V1State;
        /**
         * Output only. The creation timestamp.
         * @format date-time
         */
        readonly createTime?: string;
        /**
         * Output only. The last update timestamp.
         * @format date-time
         */
        readonly updateTime?: string;
        /** Output only. The etag for this resource. */
        readonly etag?: string;
      },
      query?: {
        /** Optional. If set to true, allows updating sensitive fields. */
        allowMissing?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<V1Webhook, GooglerpcStatus>({
        path: `/api/v1/${webhookName}`,
        method: "PATCH",
        query: query,
        body: webhook,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  file = {
    /**
     * No description
     *
     * @tags ResourceService
     * @name ResourceServiceGetResourceBinary
     * @summary GetResourceBinary returns a resource binary by name.
     * @request GET:/file/{name}/{filename}
     */
    resourceServiceGetResourceBinary: (
      name: string,
      filename: string,
      query?: {
        /** A flag indicating if the thumbnail version of the resource should be returned */
        thumbnail?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<ApiHttpBody, GooglerpcStatus>({
        path: `/file/${name}/${filename}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
