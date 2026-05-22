export type PolicyAction = 'allow' | 'block' | 'confirm';

export interface ToolPolicy {
  name: string;
  action: PolicyAction;
  reason?: string;
}

export class PolicyEngine {
  private policies: Map<string, ToolPolicy>;

  constructor(initialPolicies: ToolPolicy[] = []) {
    this.policies = new Map(initialPolicies.map(p => [p.name, p]));
    this.setupDefaultPolicies();
  }

  private setupDefaultPolicies() {
    // Default: tools are allowed unless specified.
    // In a high-security environment, this would be 'block' by default.
    const defaults: ToolPolicy[] = [
      { name: 'email.send', action: 'confirm', reason: 'Sending emails can be intrusive or spammy.' },
      { name: 'http.request', action: 'confirm', reason: 'External HTTP requests can leak data or trigger unexpected actions.' },
      { name: 'util.echo', action: 'allow' },
      { name: 'util.now', action: 'allow' },
    ];

    defaults.forEach(p => {
      if (!this.policies.has(p.name)) {
        this.policies.set(p.name, p);
      }
    });
  }

  /**
   * Evaluates if a tool call should be executed.
   * @param toolName The name of the tool being called.
   * @returns The action to take: allow, block, or confirm.
   */
  public evaluate(toolName: string): PolicyAction {
    const policy = this.policies.get(toolName);
    if (policy) {
      return policy.action;
    }
    // Fallback: allow unknown tools for now, but in production we should block.
    return 'allow';
  }

  public updatePolicy(name: string, action: PolicyAction, reason?: string) {
    this.policies.set(name, { name, action, reason });
  }

  public getPolicy(name: string): ToolPolicy | undefined {
    return this.policies.get(name);
  }
}

export const defaultPolicyEngine = new PolicyEngine();
