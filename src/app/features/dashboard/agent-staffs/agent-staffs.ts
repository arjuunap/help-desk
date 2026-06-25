import { ChangeDetectorRef, Component } from '@angular/core';
import { AgentServices } from '../../../core/services/agent/agent-services';
import { AuthServices } from '../../../core/services/auth/auth-services';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-staffs',
  imports: [FormsModule,CommonModule],
  templateUrl: './agent-staffs.html',
  styleUrl: './agent-staffs.css',
})
export class AgentStaffs {
  constructor(private agentService: AgentServices,
    private authServices : AuthServices,
    private cd : ChangeDetectorRef
  ){ 
    this.agentId = this.authServices.getUserId();
  }
 
  agentId : number;

  agents: any[] = [];
filteredAgents: any[] = [];

staffs: any[] = [];
filteredStaffs: any[] = [];

searchTerm = '';
staffSearch = '';

selectedAgent: any = null;

showAssignModal = false;
  ngOnInit(){
    this.getAgentStaffs();
    
  }
  getAgentStaffs(){
    this.agentService.getAgentStaffs(this.agentId).subscribe({
      next:(data)=>{
        console.log("agent staffs",data);
      }
    })
  }
  assignAgent(agentId: number,staffId: number){
    this.agentService.assignAgent(agentId,staffId).subscribe({
      next:(data)=>{
        console.log("agent assigned",data);
      }
    })
    
  }

  filterAgents(): void {

  const term =
    this.searchTerm.toLowerCase().trim();

  this.filteredAgents =
    this.agents.filter(agent =>

      agent.fullName
        ?.toLowerCase()
        .includes(term)

      ||

      agent.email
        ?.toLowerCase()
        .includes(term)
    );
}


openAssignModal(agent: any): void {

  this.selectedAgent = agent;

  this.showAssignModal = true;

  this.agentService
    .getAgentStaffs(agent.id)
    .subscribe({
      next: (res: any) => {

        this.staffs = res;

        this.filteredStaffs = res;

        this.cd.markForCheck();
      }
    });
}


filterStaffs(): void {

  const term =
    this.staffSearch.toLowerCase();

  this.filteredStaffs =
    this.staffs.filter(staff =>

      staff.fullName
        ?.toLowerCase()
        .includes(term)

      ||

      staff.email
        ?.toLowerCase()
        .includes(term)
    );
}


assignStaff(staffId: number): void {

  this.agentService
    .assignAgent(
      this.selectedAgent.id,
      staffId
    )
    .subscribe({
      next: () => {

        this.closeAssignModal();

      }
    });
}

closeAssignModal(): void {

  this.showAssignModal = false;

  this.selectedAgent = null;

  this.staffSearch = '';
}

}
