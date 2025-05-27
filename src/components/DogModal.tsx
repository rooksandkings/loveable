const DogModal: React.FC<DogModalProps> = ({ dog, isOpen, onClose }) => {
  // ... existing code ...

  // Replace calculated DFTD eligibility with API field
  const dftdEligible = dog.DFTD_eligibility === "Yes";

  // ... existing code ...

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* ... existing code ... */}
      
      <div className="dog-badges">
        {dog.Foster_status === "Yes" && (
          <span className="badge foster-badge">In Foster</span>
        )}
        {dftdEligible && (
          <span className="badge dftd-badge">DFTD Eligible</span>
        )}
      </div>

      {/* ... existing code ... */}
    </div>
  );
}; 