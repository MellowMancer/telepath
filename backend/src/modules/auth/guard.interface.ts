export interface JwtPayload {
  /** The MongoDB User ID */
  userId: string;

  /** The user's role (e.g., 'admin', 'user') */
  role?: string;

  /** 
   * It is highly recommended to include the username too, 
   * so you don't have to query the DB to see who is chatting.
   */
  username: string;

  /** Standard JWT Issued At timestamp (optional) */
  iat?: number;

  /** Standard JWT Expiration timestamp (optional) */
  exp?: number;
}